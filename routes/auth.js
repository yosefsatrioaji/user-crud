const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { authValidation } = require('../validation');


router.post('/signup', async (req, res) => {
    //validate
    const { error } = authValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check if user already exists
    const userExist = await User.findOne({ username: req.body.username });
    if (userExist) return res.status(400).send('User already exists');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //signup logic
    const user = new User(
        {
            username: req.body.username,
            password: hashedPassword,
        }
    );
    try {
        const newUser = await user.save();
        const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 604800000 });
        res.header('Authorization', token).json({ token: token, refreshToken: refreshToken });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //validate
    const { error } = authValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exists
    const userExist = await User.findOne({ username: req.body.username });
    if (!userExist) return res.status(400).send('Username or password is incorrect');

    //login logic
    const validPass = await bcrypt.compare(req.body.password, userExist.password);
    if (!validPass) return res.status(400).send('Username or password is incorrect');

    //create and assign token
    const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ _id: userExist._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 604800000 });
    res.header('Authorization', token).json({ token: token, refreshToken: refreshToken });

});

router.post('/refresh', async (req, res) => {
    if (!req.cookies?.jwt) return res.status(400).send('No refresh token');
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 604800000 });
        res.header('Authorization', token).json({ token: token, refreshToken: refreshToken });
    });
});

module.exports = router;
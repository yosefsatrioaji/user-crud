const router = require('express').Router();
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const { authValidation } = require('../validation');
const User = require('../model/User');

router.get('/alluser', verifyToken, async (req, res) => {
    const user = req.user;
    if (await checkRole(user) !== 'admin') return res.status(401).send('You are not authorized to perform this action');
    
    const users = await User.find();
    res.json(users);
});

router.post('/searchbyuname', verifyToken, async (req, res) => {
    const user = req.user;
    if (await checkRole(user) !== 'admin') return res.status(401).send('You are not authorized to perform this action');

    const userData = await User.findOne({ username: req.body.username });
    if (!userData) return res.status(400).send('User does not exist');
    res.send(userData);
});

router.post('/createuser', verifyToken, async (req, res) => {
    const user = req.user;
    if (await checkRole(user) !== 'admin') return res.status(401).send('You are not authorized to perform this action');
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
    const addUser = new User(
        {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
        }
    );
    try {
        const newUser = await addUser.save();
        res.send(newUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/deleteuser', verifyToken, async (req, res) => {
    const user = req.user;
    if (await checkRole(user) !== 'admin') return res.status(401).send('You are not authorized to perform this action');
    const userData = await User.findOne({ username: req.body.username });
    if (!userData) return res.status(400).send('User does not exist');
    try {
        await User.deleteOne({ username: req.body.username });
        res.send('User deleted');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/updateuser', verifyToken, async (req, res) => {
    const user = req.user;
    if (await checkRole(user) !== 'admin') return res.status(401).send('You are not authorized to perform this action');
    const userData = await User.findOne({ username: req.body.username });
    if (!userData) return res.status(400).send('User does not exist');
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        userData.password = hashedPassword;
    }
    userData.role = req.body.role;

    try {
        await User.updateOne({ username: req.body.username }, { $set: { role: req.body.role } });
        res.send('User updated');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
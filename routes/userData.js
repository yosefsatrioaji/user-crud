const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const { updateValidation } = require('../validation');
const User = require('../model/User');

router.get('/', verifyToken, async (req, res) => {
    const user = req.user;
    const userData = await User.findById(user._id);

    res.json({ usename: userData.username, role: userData.role });
});

router.patch('/update', verifyToken, async (req, res) => {
    const user = req.user;
    const userData = await User.findById(user._id);

    //validate
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        userData.password = hashedPassword;
    }

    if (req.body.username) {
        //check if user already exists
        const userExist = await User.findOne({ username: req.body.username });
        if (userExist) return res.status(400).send('User already exists');
        userData.username = req.body.username;
    }

    try {
        await userData.save();
        res.send('User updated');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
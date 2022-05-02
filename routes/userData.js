const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../model/User');

router.get('/', verifyToken, async (req, res) => {
    const user = req.user;
    const userData = await User.findOne({ _id: user._id });

    res.json({ usename: userData.username, role: userData.role });
});

module.exports = router;
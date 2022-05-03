const User = require('../model/User');

/* This is a middleware function that checks user's role. */
module.exports = async function(user){
    const userData = await User.findOne({ _id: user._id });
    return userData.role;
}
const User = require('../model/User');

module.exports = async function(user){
    const userData = await User.findOne({ _id: user._id });
    return userData.role;
}
const Joi = require('joi');


//Auth validation
const authValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        role: Joi.string().valid('user', 'admin')
    });
    return schema.validate(data);
};

const updateValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255),
        password: Joi.string().min(6).max(255),
        role: Joi.string().valid('user', 'admin')
    });
    return schema.validate(data);
};

module.exports.authValidation = authValidation;
module.exports.updateValidation = updateValidation;
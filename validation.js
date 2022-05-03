const Joi = require('joi');


//Auth validation
/**
 * It takes in a data object, and returns a validation object.
 * 
 * The validation object has two properties:
 * 
 * error: If the data object is invalid, this property will contain an error object.
 * value: If the data object is valid, this property will contain the data object.
 * @returns The return value is an object with two properties:
 * error: If validation fails, this property will contain an object with details about the error.
 * value: If validation succeeds, this property will contain the value that was validated.
 */
const authValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        role: Joi.string().valid('user', 'admin')
    });
    return schema.validate(data);
};

/**
 * It takes in a data object, and returns a validation object.
 * 
 * The validation object has two properties:
 * 
 * error: If the data object is invalid, this property will contain an error object.
 * value: If the data object is valid, this property will contain the data object.
 * @returns The return value is an object with two properties:
 * error: If validation fails, this property will contain an object with details about the error.
 * value: If validation succeeds, this property will contain the value that was validated.
 */
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
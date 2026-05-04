const Joi = require('joi');
const AppError = require('../utils/AppError');

// 🔹 helper to build middleware from any schema
const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,      // show all errors, not just first
    allowUnknown: false,    // block extra fields
    stripUnknown: true      // remove unknown fields if allowed
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(new AppError(message, 400));
  }

  // use sanitized value (important!)
  req.body = value;
  next();
};

module.exports = validate;
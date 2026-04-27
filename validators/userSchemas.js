const Joi = require('joi');

const name = Joi.string().trim().min(2).max(50).required();
const email = Joi.string().email().lowercase().trim().required();
const password = Joi.string().min(6).max(50).required();

const registerSchema = Joi.object({
  name,
  email,
  password
});

const loginSchema = Joi.object({
  email,
  password
});

const forgotPasswordSchema = Joi.object({
  email
});

const verifyOtpSchema = Joi.object({
  email,
  otp: Joi.string().length(6).required()
});

const resetPasswordSchema = Joi.object({
  email,
  newPassword: Joi.string().min(6).max(50).required()
});

const updateUserSchema = Joi.object({
  name
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  updateUserSchema
};

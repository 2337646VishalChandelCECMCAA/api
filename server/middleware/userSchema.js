const Joi = require('joi');

// 📌 Common fields
const email = Joi.string().email().lowercase().trim().required();
const password = Joi.string().min(6).max(50).required();

// 🔹 Register
const registerSchema = Joi.object({
  email,
  password,
  role: Joi.string().valid('user', 'admin').optional()
});

// 🔹 Login
const loginSchema = Joi.object({
  email,
  password
});

// 🔹 Forgot Password
const forgotPasswordSchema = Joi.object({
  email
});

// 🔹 Verify OTP
const verifyOtpSchema = Joi.object({
  email,
  otp: Joi.string().length(6).required()
});

// 🔹 Reset Password
const resetPasswordSchema = Joi.object({
  email,
  newPassword: Joi.string().min(6).max(50).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema
};
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// 🌐 General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// 🔐 Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts ❌" },
  keyGenerator: (req) => ipKeyGenerator(req.ip) + (req.body.email || '')
});

// 🔑 OTP limiter
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP attempts ❌" },
  keyGenerator: (req) => ipKeyGenerator(req.ip) + (req.body.email || '')
});

module.exports = { apiLimiter, loginLimiter, otpLimiter };
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {loginLimiter,otpLimiter,apiLimiter,} = require('../middleware/rateLimiter');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  updateUserSchema
} = require('../validators/userSchemas');


const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require('../controllers/userController');

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// 🔥 Specific routes FIRST
router.post('/register', apiLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', otpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', otpLimiter, validate(resetPasswordSchema), resetPassword);

router.get('/profile', auth, (req, res) => {
  res.json({
    message: "Protected 🔐",
    user: req.user
  });
});

router.get('/', getUsers);

// 🔻 Dynamic routes LAST
router.get('/:id', getUserById);
router.put('/:id', auth, validate(updateUserSchema), updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
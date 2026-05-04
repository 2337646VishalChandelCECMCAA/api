const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const crypto = require('crypto');
const emailQueue = require('../queues/emailQueue');
const sendEmail = require('../utils/sendEmail');
const AppError = require('../utils/AppError');

// READ ALL
const { client, isRedisReady } = require('../config/redis');

exports.getUsers = async (req, res, next) => {
  try {
    const cacheKey = 'users';

    // 🔹 1. Check cache
    let cachedData = null;

    if (isRedisReady()) {
      try {
        cachedData = await client.get(cacheKey);
      } catch (error) {
        cachedData = null;
      }
    }

    if (cachedData) {
      return res.json({
        source: "cache",
        data: JSON.parse(cachedData)
      });
    }

    // 🔹 2. Fetch from DB
    const users = await User.find();

    // 🔹 3. Save to cache (with expiry)
    if (isRedisReady()) {
      try {
        await client.setEx(cacheKey, 60, JSON.stringify(users));
      } catch (error) {
        // Cache write failures should not block the API response.
      }
    }

    res.json({
      source: "db",
      data: users
    });

  } catch (err) {
    next(err);
  }
};
// READ ONE
exports.getUserById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(new AppError('Invalid user id ❌', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User fetched",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// CREATE
exports.createUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "All fields required ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated",
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted",
      data: deletedUser
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required ❌" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered ✅",
      data: user
    });

  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required ❌" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      password: { $exists: true, $type: 'string' }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found or account has no password saved ❌"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password ❌" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required ❌"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.email) {
      return res.status(404).json({
        error: "User not found ❌"
      });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.otpAttempts = 0;

    await user.save();

    try {
      await emailQueue.add({
        email: user.email,
        otp
      });
    } catch (queueErr) {
      // Fallback keeps password reset working if Redis queue is unavailable.
      console.warn(`⚠️ Queue unavailable, sending OTP directly: ${queueErr.message}`);
      await sendEmail(user.email, 'OTP', `Your OTP is ${otp}`);
    }

    res.json({
      message: "OTP sent to email ✅"
    });

  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required ❌"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found ❌" });
    }

    // 🔒 No OTP requested
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        error: "No OTP request found ❌"
      });
    }

    // 🚫 Too many attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        error: "Too many attempts. Try again later ❌"
      });
    }

    // ⏱️ Expiry check FIRST
    if (user.otpExpires < Date.now()) {
      user.otpAttempts = 0;
      await user.save();

      return res.status(400).json({ error: "OTP expired ❌" });
    }

    // ❌ Wrong OTP
    if (!(await bcrypt.compare(otp, user.otp))) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        error: `Invalid OTP ❌ (${user.otpAttempts}/5)`
      });
    }

    // ✅ Success
    user.otpAttempts = 0;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;

    await user.save();

    res.json({ message: "OTP verified ✅" });

  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: "Email and new password required ❌"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        error: "User not found ❌"
      });
    }

    // 🔒 Must verify OTP first
    if (!user.isOtpVerified) {
      return res.status(403).json({
        error: "OTP not verified ❌"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.isOtpVerified = false; // reset flag

    await user.save();

    res.json({
      message: "Password reset successful ✅"
    });

  } catch (err) {
    next(err);
  }
};
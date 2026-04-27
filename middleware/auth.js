const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const AppError = require('../utils/AppError');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Authorization token required ❌', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ includes id + role
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new AppError('Invalid token ❌', 401));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new AppError('Unauthorized ❌', 401));
    }
};

module.exports = auth;
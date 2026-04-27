const AppError = require('../utils/AppError');

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError('Access denied ❌', 403));
  }

  next();
};

module.exports = isAdmin;
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // 🔍 Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong ❌",

    // 🔥 Show stack only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
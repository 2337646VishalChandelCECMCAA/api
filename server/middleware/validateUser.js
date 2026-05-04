const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name is required ❌"
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      error: "Name must be at least 3 characters ❌"
    });
  }

  if (!/^[A-Za-z]+$/.test(name)) {
    return res.status(400).json({
      error: "Only letters allowed ❌"
    });
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format ❌"
      });
    }
  }

  if (password !== undefined && password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters ❌"
    });
  }

  next();
};

module.exports = validateUser;
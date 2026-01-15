const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

export const validateSignup = (req, res, next) => {
  const { name, email, address, password } = req.body;

  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
    });
  }

  if (address && address.length > 400) {
    return res.status(400).json({
      message: "Address must be at most 400 characters",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters, include one uppercase letter and one special character",
    });
  }

  next();
};

export const validatePasswordUpdate = (req, res, next) => {
  const { currentPassword } = req.body;

  if (!passwordRegex.test(currentPassword)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters, include one uppercase letter and one special character",
    });
  }

  next();
};

export const validateRating = (req, res, next) => {
  const { rating } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be an integer between 1 and 5",
    });
  }

  next();
};

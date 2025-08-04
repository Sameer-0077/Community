const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;

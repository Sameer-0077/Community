const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) throw new Error("Not authorized");

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodeToken.userId).select("-password");

    if (!user) throw new Error("Invalid token");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = isAuthenticated;

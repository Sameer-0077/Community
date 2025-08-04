const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res.status(400).json({ error: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      bio,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server erorr during singup", deatils: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed. Please try again." });
  }
};

const getCurrentUser = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };

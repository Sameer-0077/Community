const express = require("express");
const validateNewUser = require("../middlewares/validateNewUser");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controllers/authController");
const validateAuthUser = require("../middlewares/validateAuthUser");
const isAuthenticated = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", validateNewUser, registerUser);
router.post("/login", validateAuthUser, loginUser);
router.get("/logout", logoutUser);
router.get("/current-user", isAuthenticated, getCurrentUser);

module.exports = router;

const express = require("express");
const validateNewUser = require("../middlewares/validateNewUser");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const validateAuthUser = require("../middlewares/validateAuthUser");
const router = express.Router();

router.post("/signup", validateNewUser, registerUser);
router.post("/login", validateAuthUser, loginUser);
router.get("/logout", logoutUser);

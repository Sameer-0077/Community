const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
} = require("../controllers/postController");
const router = express.Router();

router.post("/create-post", isAuthenticated, createPost);
router.get("/all-post", getAllPosts);
router.get("/user/:userId", isAuthenticated, getUserPosts);

module.exports = router;

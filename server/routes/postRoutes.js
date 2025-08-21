const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
} = require("../controllers/postController");
const router = express.Router();

router.post("/create-post", isAuthenticated, createPost);
router.get("/all-post", getAllPosts);
router.get("/user/:userId", isAuthenticated, getUserPosts);
router.delete("/user/:postId", isAuthenticated, deletePost);

module.exports = router;

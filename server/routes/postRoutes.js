const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
} = require("../controllers/postController");
const {
  newComment,
  getCommentsForPost,
  deleteComment,
  getRepliesForComment,
  deleteReply,
} = require("../controllers/commentController");
const {
  togglePostLike,
  toggleCommentLike,
  getAllLikesOnPost,
  getAllLikesOnComment,
} = require("../controllers/likeController");
const router = express.Router();

// Post routes
router.post("/create-post", isAuthenticated, createPost);
router.get("/all-post", getAllPosts);
router.get("/user/:userId", isAuthenticated, getUserPosts);
router.delete("/user/:postId", isAuthenticated, deletePost);

// Comments routes
router.post("/add-comment/:postId", isAuthenticated, newComment);
router.get("/all-comment/:postId", getCommentsForPost);
router.delete("/delete-comment/:commentId", isAuthenticated, deleteComment);
router.delete("/delete-reply/:replyId", isAuthenticated, deleteReply);
router.get("/all-replies/:commentId", getRepliesForComment);

// Like routes
router.get("/like-post/:postId", isAuthenticated, togglePostLike);
router.get("/like-comment/:commentId", isAuthenticated, toggleCommentLike);
router.get("/all-likes-post/:postId", getAllLikesOnPost);
router.get("/all-likes-comment/:commentId", getAllLikesOnComment);

module.exports = router;

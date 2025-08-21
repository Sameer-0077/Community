const { findByIdAndDelete } = require("../models/comment");
const Like = require("../models/like");

const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ error: "Bad request!!" });
    }

    await Like.create({
      post: postId,
      likedBy: req.user._id,
    });
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: "Bad request!!" });
    }

    await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeLikeFromPost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ error: "Bad request!!" });
    }

    const like = await Like.find({ post: postId });
    if (!like) {
      return res.status(404).json({ error: "Like doesn't found" });
    }
    await Like.findByIdAndDelete(like);
    res.status(200).json({ message: "Liked remove successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeLikeFromComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: "Bad request!!" });
    }

    const like = await Like.find({ comment: commentId });
    if (!like) {
      return res.status(404).json({ error: "Like doesn't found" });
    }
    await Like.findByIdAndDelete(like);
    res.status(200).json({ message: "Liked remove successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  likePost,
  likeComment,
  removeLikeFromPost,
  removeLikeFromComment,
};

const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

const togglePostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ error: "Bad request" });
    }

    const existingLike = await Like.findOne({
      post: postId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ message: "Post unliked successfully", liked: false });
    }

    const newLike = await Like.create({
      post: postId,
      likedBy: req.user._id,
    });

    res
      .status(201)
      .json({ message: "Post liked successfully", liked: true, like: newLike });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;

    const existingLike = await Like.findOne({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({
        message: "Comment unliked successfully",
        liked: false,
      });
    }

    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });

    res.status(201).json({
      message: "Comment liked successfully",
      liked: true,
      like: newLike,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getAllLikesOnPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const likeCount = await Like.countDocuments({
      post: postId,
      comment: null,
    });
    res.status(200).json({ totalLike: likeCount });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
const getAllLikesOnComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const likeCount = await Like.countDocuments({
      comment: commentId,
      post: null,
    });
    res.status(200).json({ totalLike: likeCount });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = {
  togglePostLike,
  toggleCommentLike,
  getAllLikesOnComment,
  getAllLikesOnPost,
};

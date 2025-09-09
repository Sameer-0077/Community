const Comment = require("../models/comment");
const Like = require("../models/like");
const Post = require("../models/post");

const newComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    const { postId } = req.params;

    if (!content)
      return res.status(400).json({ error: "Comment cannot be empty!" });

    if (!postId) return res.status(400).json({ error: "Bad request!!" });

    const post = Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Comment.create({
      content: content,
      post: postId,
      author: req.user._id,
      reply: parentCommentId || null,
    });

    res.status(201).json({
      message: parentCommentId
        ? "Reply added successfully"
        : "Commment added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId) return res.status(400).json({ error: "Bad request!!" });

    const comment = await Comment.findById(commentId);
    console.log(comment);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: " You are not authorized to delete this comment" });
    }

    const replies = await Comment.find({ reply: commentId }).select("_id");
    const replyIds = replies.map((reply) => reply._id);

    await Like.findOneAndDelete({ comment: commentId });

    if (replyIds.length) {
      await Comment.deleteMany({ _id: { $in: replyIds } });
    }

    await Comment.findOneAndDelete({ _id: commentId });

    res
      .status(200)
      .json({ message: "Comment (and its replies) deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    if (!replyId) {
      return res.status(400).json({ error: "Bad request!!" });
    }

    const reply = await Comment.findById(replyId);

    if (!reply) return res.status(404).json({ error: "Reply not found!" });

    if (reply.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this reply" });
    }

    await Comment.findOneAndDelete({ _id: replyId });

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comments = await Comment.find({ post: postId, reply: null })
      .populate("author", "name")
      .populate({
        path: "reply",
        populate: { path: "author", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRepliesForComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comments not found" });
    }

    const replies = await Comment.find({ reply: commentId })
      .populate("author", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  newComment,
  deleteComment,
  deleteReply,
  getCommentsForPost,
  getRepliesForComment,
};

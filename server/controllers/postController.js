const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(401).json({ error: "Content is required" });
    }

    const post = await Post.create({
      content,
      author: req.user._id,
    });

    res.status(201).json(await post.populate("author", "name"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all posts for feed
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(posts);
};

// Get posts by a specific user
const getUserPosts = async (req, res) => {
  const userId = req.params.userId;
  const posts = await Post.find({ author: userId })
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(posts);
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) return res.status(400).json({ error: "Bad request!" });
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check authorization
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // find top-level comments for this post (just _id)
    const comments = await Comment.find({ post: postId }).select("_id");
    const commentIds = comments.map((comment) => comment._id);

    // find direct replies to those comments (one-level only)
    const replies = commentIds.length
      ? await Comment.find({ reply: { $in: commentIds } }).select("_id")
      : [];

    const replyIds = replies.map((reply) => reply._id);

    // 3) delete likes on: the post itself, and any comment/reply IDs
    const commentAndReplies = commentIds.concat(replyIds);
    await Like.deleteMany({
      $or: [
        { post: postId },
        ...(commentAndReplies.length
          ? [{ comment: { $in: commentAndReplies } }]
          : []),
      ],
    });

    // 4) delete replies first, then top-level comments
    if (replyIds.length) {
      await Comment.deleteMany({ _id: { $in: replyIds } });
    }

    if (commentIds.length) {
      await Comment.deleteMany({ _id: { $in: commentIds } });
    }
    // finally delete the post
    await Post.findOneAndDelete({ _id: postId });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
};

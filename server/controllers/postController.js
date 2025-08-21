const Post = require("../models/post");

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
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);
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

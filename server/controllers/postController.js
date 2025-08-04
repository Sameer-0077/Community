const Post = require("../models/post");

const createPost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const post = await Post.create({
    content,
    author: req.user._id,
  });

  res.status(201).json(await post.populate("author", "name"));
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

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
};

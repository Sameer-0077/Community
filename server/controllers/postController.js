const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const cloudinary = require("../utils/cloudinary");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const files = req.files || [];

    // Post must have text or media
    if (!text && files.length === 0) {
      return res.status(400).json({ error: "Post cannot be empty" });
    }

    // count images and video
    let imageCount = 0;
    let videoCount = 0;

    for (const file of files) {
      if (file.mimetype.startsWith("image/")) {
        imageCount++;
      } else if (file.mimetype.startsWith("video/")) {
        videoCount++;
      }
    }

    // Limit the number of images and video
    if (imageCount > 4) {
      return res
        .status(400)
        .json({ error: "You can upload maximum of 4 image per post" });
    }
    if (videoCount > 1) {
      return res
        .status(400)
        .json({ error: "You can upload only one video per post" });
    }

    // Max media should be not more than 5
    if (imageCount + videoCount > 5) {
      return res
        .status(400)
        .json({ error: "You can upload a maximum of 5 media files per post" });
    }

    // Upload media on Cloudinary
    let media = [];

    for (const file of files) {
      const resourceType = file.mimetype.startsWith("video/")
        ? "video"
        : "image";

      const result = await cloudinaryUpload(
        file,
        `community-posts/user/${req.user.id}/${resourceType}s`
      );

      media.push({
        url: result.secure_url,
        type: resourceType,
        publicId: result.public_id,
      });
    }

    // Creating post
    const post = await Post.create({
      text,
      media,
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

    // delete media from cloudinary
    for (const item of post.media) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.resourceType,
      });
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

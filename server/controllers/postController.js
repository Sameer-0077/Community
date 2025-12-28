const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const cloudinary = require("../utils/cloudinary");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const { mongoose } = require("mongoose");

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

      const optimizedUrl = result.secure_url.replace(
        "/upload/",
        "/upload/w_800,q_auto,f_auto/"
      );

      console.log("Url is : ", result.secure_url);
      console.log("Optimized url is : ", optimizedUrl);
      console.log("Public Id is: ", result.public_id);

      media.push({
        url: optimizedUrl,
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

//Get all post

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get posts for feed
const getFeedPosts = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const { cursor, limit = 10 } = req.query;

    let parsedCursor = null;
    if (cursor) {
      parsedCursor = JSON.parse(cursor);
    }

    const matchStage = {};
    if (parsedCursor?.createdAt && parsedCursor?._id) {
      matchStage.$or = [
        { createdAt: { $lt: new Date(parsedCursor.createdAt) } },
        {
          createdAt: new Date(parsedCursor.createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(parsedCursor._id) },
        },
      ];
    }
    const posts = await Post.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1, id: -1 } },
      { $limit: Number(limit) + 1 },

      //Author
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: "$author" },

      //Likes
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            { $project: { likedBy: 1 } },
          ],
          as: "likes",
        },
      },

      //Comment
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },

      //Computed fileds
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          // isLiked: userId
          //   ? {
          //       $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"],
          //     }
          //   : false,
        },
      },

      //Cleanup the response
      {
        $project: {
          likes: 0,
          comments: 0,
        },
      },
    ]);

    let nextCursor = null;

    if (posts.length > limit) {
      const last = posts[limit - 1];
      nextCursor = {
        createdAt: last.createdAt,
        _id: last._id,
      };
      posts.pop();
    }

    res.status(200).json({
      posts,
      nextCursor,
    });
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .json({ error: "Failed to load feed", errorMessage: error.message });
  }
};

// Get posts by a specific user
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "userPost",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: "$userPost" },

      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            { $project: { likedBy: 1 } },
          ],
          as: "likes",
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },

      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          isLiked: userId
            ? {
                $in: [
                  new mongoose.Types.ObjectId(req.user._id),
                  "$likes.likedBy",
                ],
              }
            : false,
        },
      },

      {
        $project: {
          likes: 0,
          comments: 0,
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load user posts",
      errorMessage: error.message,
    });
  }
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
      try {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.resourceType,
        });
      } catch (error) {
        throw error;
      }
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
  getFeedPosts,
  getUserPosts,
  deletePost,
  getAllPost,
};

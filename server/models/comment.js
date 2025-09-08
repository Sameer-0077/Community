const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre("findOneAndDelete", async function (next) {
  try {
    const commentId = this.getQuery()["_id"];
    await mongoose.model("Comment").deleteMany({ reply: commentId });
    await Like.deleteMany({ comment: commentId });
    next();
  } catch (error) {
    next(error);
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

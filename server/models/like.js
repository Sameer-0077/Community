const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index(
  { likedBy: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $type: "objectId" } } }
);

likeSchema.index(
  { likedBy: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $type: "objectId" } } }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;

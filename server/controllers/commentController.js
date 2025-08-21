const Comment = require("../models/comment");

const newComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content)
      return res.status(400).json({ error: "Comment cannot be empty!" });

    if (!postId) return res.status(400).json({ error: "Bad request!!" });

    await Comment.create({
      content,
      post: postId,
      owner: req.user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) return res.status(400).json({ error: "Bad request!!" });

    const comment = await Comment.find({ post: postId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await Comment.findByIdAndDelete(comment);

    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

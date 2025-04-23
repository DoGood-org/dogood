// routes/stats.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

// GET /api/stats/user/:id
router.get("/user/:id", auth, async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await Post.find({ user: userId });
    const postCount = posts.length;

    const commentCount = posts.reduce((total, post) => total + post.comments.length, 0);
    const likeCount = posts.reduce((total, post) => total + post.likes.length, 0);

    const messageCount = await Message.countDocuments({ sender: userId });

    const lastPost = posts.sort((a, b) => b.updatedAt - a.updatedAt)[0];
    const lastActivity = lastPost?.updatedAt || null;

    res.json({
      posts: postCount,
      comments: commentCount,
      likes: likeCount,
      messagesSent: messageCount,
      lastActivity,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;

const Post = require("../models/Post");

// GET /api/posts
// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getPosts,
};

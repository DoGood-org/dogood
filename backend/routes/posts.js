const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "name");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Get current user's posts
router.get("/mine", authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Create a new post
router.post("/", authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            author: req.user.id,
            content: req.body.content,
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;

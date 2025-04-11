// routes/posts.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// GET /api/posts - get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/posts/mine - get posts by authenticated user
router.get("/mine", auth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/posts - create new post
router.post("/", auth, async (req, res) => {
    const { title, content, category, urgency } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const newPost = new Post({
            title,
            content,
            category: category || "General",
            urgency: urgency || "Medium",
            user: req.user.id,
        });

        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Failed to create post" });
    }
});

// PUT /api/posts/:id - update post
router.put("/:id", auth, async (req, res) => {
    const { title, content, category, urgency } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.urgency = urgency || post.urgency;

        const updated = await post.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update post" });
    }
});

// DELETE /api/posts/:id - delete post
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete post" });
    }
});

// PUT /api/posts/like/:id - like or unlike post
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;
        const liked = post.likes.includes(userId);

        if (liked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ likes: post.likes.length, liked: !liked });
    } catch (err) {
        res.status(500).json({ message: "Failed to toggle like" });
    }
});

// POST /api/posts/comment/:id - add comment
router.post("/comment/:id", auth, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.unshift({
            user: req.user.id,
            text,
        });

        await post.save();
        res.status(201).json(post.comments);
    } catch (err) {
        res.status(500).json({ message: "Failed to add comment" });
    }
});

// GET /api/posts/:id - get post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "name avatar");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch post" });
    }
});

module.exports = router;

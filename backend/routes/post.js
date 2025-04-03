const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

router.post('/', protect, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ msg: 'Post cannot be empty' });

        const newPost = new Post({
            content,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['name', 'avatar']).sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

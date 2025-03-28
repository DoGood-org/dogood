const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// 📌 Создание нового поста
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ msg: 'Пост не может быть пустым' });

        const newPost = new Post({
            content,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Получение всех постов
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['name', 'avatar']).sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

module.exports = router;

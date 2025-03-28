const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

// 📌 Получение всех постов
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

// 📌 Создание нового поста (только авторизованные пользователи)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ msg: "Заполните все поля" });

        const newPost = new Post({ user: req.user.id, title, content });
        await newPost.save();

        res.json(newPost);
    } catch (error) {
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

module.exports = router;

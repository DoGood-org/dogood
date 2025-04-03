const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');
const User = require('../models/User');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({ users: req.user.id })
            .populate('users', ['name', 'avatar'])
            .populate('messages.user', ['name', 'avatar'])
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        const existingChat = await Chat.findOne({ users: { $all: [req.user.id, userId] } });

        if (existingChat) return res.status(400).json({ msg: 'Chat already exists' });

        const chat = new Chat({
            users: [req.user.id, userId],
            messages: []
        });

        await chat.save();
        res.json(chat);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/send', authMiddleware, async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const chat = await Chat.findById(chatId);

        if (!chat) return res.status(404).json({ msg: 'Chat not found' });

        const newMessage = {
            user: req.user.id,
            text
        };

        chat.messages.push(newMessage);
        chat.updatedAt = Date.now();
        await chat.save();

        res.json(chat);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

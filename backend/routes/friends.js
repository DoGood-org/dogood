const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// 📌 Отправка заявки в друзья
router.post('/request', authMiddleware, async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ msg: 'Пользователь не найден' });
        if (user.friends.includes(friendId)) return res.status(400).json({ msg: 'Пользователь уже у вас в друзьях' });

        if (!user.friendRequestsSent.includes(friendId)) {
            user.friendRequestsSent.push(friendId);
            friend.friendRequestsReceived.push(user.id);
            await user.save();
            await friend.save();
        }

        res.json({ msg: 'Заявка отправлена' });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Принятие заявки в друзья
router.post('/accept', authMiddleware, async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ msg: 'Пользователь не найден' });

        if (user.friendRequestsReceived.includes(friendId)) {
            user.friends.push(friendId);
            friend.friends.push(user.id);

            user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id !== friendId);
            friend.friendRequestsSent = friend.friendRequestsSent.filter(id => id !== user.id);

            await user.save();
            await friend.save();
        }

        res.json({ msg: 'Теперь вы друзья' });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Удаление из друзей
router.post('/remove', authMiddleware, async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ msg: 'Пользователь не найден' });

        user.friends = user.friends.filter(id => id !== friendId);
        friend.friends = friend.friends.filter(id => id !== user.id);

        await user.save();
        await friend.save();

        res.json({ msg: 'Друг удален' });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Получение списка друзей
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', ['name', 'avatar']);
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Экспорт маршрута
module.exports = router;

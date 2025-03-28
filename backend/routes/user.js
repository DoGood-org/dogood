const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// 📌 Получение списка всех пользователей
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Исключаем пароли
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Получение профиля текущего пользователя
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Обновление профиля пользователя
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { name, avatar, bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.bio = bio || user.bio;

        await user.save();
        res.json({ msg: 'Профиль обновлен', user });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});
router.post('/verify', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'ngo') return res.status(403).json({ msg: 'Только НКО могут проходить верификацию' });

    user.verified = true;
    await user.save();
    res.json({ msg: 'Организация верифицирована' });
});

// 📌 Экспорт маршрута
module.exports = router;

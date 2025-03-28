const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserStats = require('../models/UserStats');
const Badge = require('../models/Badges');

// 📌 Обновление статистики пользователя
router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { donations, hours } = req.body;
        let stats = await UserStats.findOne({ user: req.user.id });

        if (!stats) {
            stats = new UserStats({ user: req.user.id });
        }

        if (donations) stats.totalDonations += donations;
        if (hours) stats.volunteeringHours += hours;

        await stats.save();

        res.json({ msg: 'Статистика обновлена', stats });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

// 📌 Получение лидерборда
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await UserStats.find()
            .populate('user', ['name', 'avatar'])
            .sort({ totalDonations: -1, volunteeringHours: -1 })
            .limit(10);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

// 📌 Выдача бейджа
router.post('/award-badge', authMiddleware, async (req, res) => {
    try {
        const { badgeId } = req.body;
        let stats = await UserStats.findOne({ user: req.user.id });

        if (!stats) {
            stats = new UserStats({ user: req.user.id });
        }

        if (!stats.badges.includes(badgeId)) {
            stats.badges.push(badgeId);
            await stats.save();
        }

        res.json({ msg: 'Бейдж получен', stats });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

module.exports = router;

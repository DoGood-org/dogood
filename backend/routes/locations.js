const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Location = mongoose.model('Location', LocationSchema);

// 📌 Добавление новой локации
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, lat, lng } = req.body;
        if (!lat || !lng) return res.status(400).json({ msg: "Координаты обязательны" });

        const location = new Location({ name, lat, lng, organization: req.user.id });
        await location.save();

        res.json({ msg: "Локация добавлена", location });
    } catch (error) {
        res.status(500).json({ msg: "Ошибка сервера", error: error.message });
    }
});

// 📌 Получение всех локаций
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find().populate('organization', 'name');
        res.json(locations);
    } catch (error) {
        res.status(500).json({ msg: "Ошибка сервера", error: error.message });
    }
});

module.exports = router;

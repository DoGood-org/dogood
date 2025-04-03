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

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, lat, lng } = req.body;
        if (!lat || !lng) return res.status(400).json({ msg: "Coordinates are required" });

        const location = new Location({ name, lat, lng, organization: req.user.id });
        await location.save();

        res.json({ msg: "Location added", location });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const locations = await Location.find().populate('organization', 'name');
        res.json(locations);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;

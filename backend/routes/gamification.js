const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const User = require("../models/User");

const AchievementSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    date: { type: Date, default: Date.now }
});

const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

// Leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        const topUsers = await User.find().sort({ points: -1 }).limit(10).select("name avatar points");
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Add achievement
router.post("/achievement", authMiddleware, async (req, res) => {
    const { type } = req.body;
    if (!type) return res.status(400).json({ msg: "Type is required" });

    try {
        const achievement = new Achievement({ user: req.user.id, type });
        await achievement.save();
        res.status(201).json({ msg: "Achievement recorded" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Add points
router.post("/points", authMiddleware, async (req, res) => {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ msg: "Invalid amount" });

    try {
        await User.findByIdAndUpdate(req.user.id, { $inc: { points: amount } });
        res.json({ msg: "Points updated" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;

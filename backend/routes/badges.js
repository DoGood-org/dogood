// routes/badges.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const badgeSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  condition: String,
  createdAt: { type: Date, default: Date.now }
});

const userBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
  awardedAt: { type: Date, default: Date.now }
});

const Badge = mongoose.model("Badge", badgeSchema);
const UserBadge = mongoose.model("UserBadge", userBadgeSchema);

// GET /api/badges - list all available badges
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: "Failed to load badges" });
  }
});

// POST /api/badges - create a new badge (admin)
router.post("/", auth, async (req, res) => {
  const { title, description, icon, condition } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Missing fields" });

  try {
    const badge = new Badge({ title, description, icon, condition });
    const saved = await badge.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create badge" });
  }
});

// GET /api/badges/user - get badges earned by current user
router.get("/user", auth, async (req, res) => {
  try {
    const list = await UserBadge.find({ userId: req.user.id }).populate("badgeId");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to load user badges" });
  }
});

module.exports = router;

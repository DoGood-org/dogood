// routes/thankyou.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const thankYouSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: String,
  message: String,
  emoji: String,
  createdAt: { type: Date, default: Date.now }
});

const ThankYou = mongoose.model("ThankYou", thankYouSchema);

// GET /api/thankyou - public feed of all thank yous
router.get("/", async (req, res) => {
  try {
    const all = await ThankYou.find().sort({ createdAt: -1 }).limit(100);
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Failed to load thank yous" });
  }
});

// POST /api/thankyou - send a thank you
router.post("/", auth, async (req, res) => {
  const { to, message, emoji } = req.body;

  if (!to || !message || !emoji) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const thank = new ThankYou({ from: req.user.id, to, message, emoji });
    const saved = await thank.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit thank you" });
  }
});

module.exports = router;

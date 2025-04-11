// routes/settings.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/settings - get current user settings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ name: user.name, theme: user.theme });
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// POST /api/settings - update user settings
router.post("/", auth, async (req, res) => {
  const { name, theme } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (theme) user.theme = theme;
    await user.save();
    res.json({ message: "Settings updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Deed = require("../models/Deed");

router.get("/", (req, res) => {
  res.json({ message: "User route active" });
});

// Get user by slug (for public profile)
router.get("/slug/:slug", async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by slug:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get deeds by user ID (for public profile)
router.get("/deeds/:userId", async (req, res) => {
  try {
    const deeds = await Deed.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(deeds);
  } catch (err) {
    console.error("Error fetching user deeds:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/all", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = router;

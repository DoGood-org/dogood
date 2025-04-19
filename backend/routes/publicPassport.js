
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Deed = require("../models/Deed"); // предполагаем, что добрые дела хранятся здесь
const Post = require("../models/Post"); // если есть посты или благодарности

// GET /api/users/:username/passport
router.get("/:username/passport", async (req, res) => {
  try {
    const user = await User.findOne({ publicSlug: req.params.username, isPublicProfile: true });
    if (!user) return res.status(404).json({ error: "User not found or profile is private" });

    const deeds = await Deed.find({ user: user._id }).sort({ createdAt: -1 }).limit(50);
    const posts = await Post.find({ to: user._id, type: "thanks" }).sort({ createdAt: -1 });

    res.json({
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      city: user.city || "",
      joinedAt: user.createdAt,
      goodDeeds: deeds.map(d => ({ title: d.title, type: d.type, date: d.createdAt })),
      thanks: posts.map(p => ({ from: p.fromName || "Anonymous", message: p.content, date: p.createdAt })),
      stats: {
        totalDeeds: deeds.length,
        totalThanks: posts.length,
        hours: user.helpHours || 0,
        donations: user.donationsCount || 0,
        karma: user.points || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

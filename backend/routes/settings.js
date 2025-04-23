// routes/settings.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/settings - get current user settings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      name: user.name,
      theme: user.theme,
      bio: user.bio || "",
      avatar: user.avatar || "",
      isEmailVerified: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// POST /api/settings - update user settings
router.post("/", auth, async (req, res) => {
  const { name, theme, bio, avatar, isPublicProfile, publicSlug } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (theme) user.theme = theme;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (isPublicProfile !== undefined) user.isPublicProfile = isPublicProfile;

    if (publicSlug) {
      const existing = await User.findOne({
        publicSlug,
        _id: { $ne: user._id },
      });
      if (existing) {
        return res.status(400).json({ error: "Slug already taken" });
      }
      user.publicSlug = publicSlug;
    }

    await user.save();
    res.json({ message: "Settings updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// POST /api/settings/password - change user password
router.post("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to change password" });
  }
});

// POST /api/settings/email/verify - resend email verification (placeholder)
router.post("/email/verify", auth, async (req, res) => {
  // Placeholder: email service integration pending
  res.json({ message: "Verification email sent (mock)" });
});

module.exports = router;

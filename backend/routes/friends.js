const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/add", authMiddleware, async (req, res) => {
  const { friendId } = req.body;
  if (!friendId) return res.status(400).json({ msg: "Friend ID is required" });

  try {
    const user = await User.findById(req.user.id);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }
    res.json({ msg: "Friend added" });
  } catch (err) {
    console.error("Add friend error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/remove", authMiddleware, async (req, res) => {
  const { friendId } = req.body;
  if (!friendId) return res.status(400).json({ msg: "Friend ID is required" });

  try {
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();
    res.json({ msg: "Friend removed" });
  } catch (err) {
    console.error("Remove friend error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "name avatar");
    res.json(user.friends || []);
  } catch (err) {
    console.error("Get friends error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

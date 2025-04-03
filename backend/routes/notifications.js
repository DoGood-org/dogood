const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

// Get all notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Mark as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { isRead: true }
    );
    res.json({ msg: "Marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

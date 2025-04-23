const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");

// GET /api/notifications/unread
router.get("/unread", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    res.json({ unread: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to count notifications" });
  }
});

// GET /api/notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// POST /api/notifications
router.post("/", auth, async (req, res) => {
  const { type, message, link } = req.body;

  if (!type || !message) {
    return res.status(400).json({ message: "Type and message are required" });
  }

  try {
    const notif = await Notification.create({
      user: req.user.id,
      type,
      message,
      link: link || "",
    });
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification" });
  }
});

// PUT /api/notifications/read/:id
router.put("/read/:id", auth, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    notif.read = true;
    await notif.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get all user chats (mock logic — replace with your Chat model if needed)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: 1 });

    const chatMap = {};

    for (let msg of messages) {
      const otherId = msg.sender.toString() === userId ? msg.receiver : msg.sender;
      if (!chatMap[otherId]) {
        const otherUser = await User.findById(otherId).select("name avatar");
        chatMap[otherId] = {
          _id: otherId,
          name: otherUser.name,
          avatar: otherUser.avatar,
          participants: [
            { _id: userId },
            { _id: otherId, name: otherUser.name, avatar: otherUser.avatar },
          ],
          messages: [],
        };
      }
      chatMap[otherId].messages.push(msg);
    }

    res.json(Object.values(chatMap));
  } catch (err) {
    console.error("Chat load error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/send", auth, async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const msg = new Message({
      sender: req.user.id,
      receiver,
      text,
      seen: false,
    });

    await msg.save();
    res.json(msg);
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ message: "Send failed" });
  }
});

// Get unread message count per chat
router.get("/unreadCount", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const unread = await Message.aggregate([
      {
        $match: {
          receiver: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {};
    unread.forEach((item) => {
      counts[item._id] = item.count;
    });

    res.json(counts);
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages from chat as read
router.post("/markAsRead", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatUserId } = req.body;

    await Message.updateMany(
        { sender: chatUserId, receiver: userId, seen: false },
        { $set: { seen: true } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

module.exports = router;

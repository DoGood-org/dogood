// ✅ API Route: /pages/api/messages/unreadCount.js
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  await dbConnect();
  const { userId } = req.query;

  try {
    const count = await Message.countDocuments({ receiver: userId, read: false });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count unread messages" });
  }
}

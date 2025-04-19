// ✅ API Route: /pages/api/messages/markRead.js
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") return res.status(405).end();

  const { sender, receiver } = req.body;

  try {
    await Message.updateMany(
      { sender, receiver, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
}

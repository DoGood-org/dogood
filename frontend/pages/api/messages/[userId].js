// /pages/api/messages/[userId].js
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  await dbConnect();
  const { userId } = req.query;
  const { currentUserId } = req.headers;

  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId }
    ]
  }).sort({ timestamp: 1 });

  res.status(200).json(messages);
}

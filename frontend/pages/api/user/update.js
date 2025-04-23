// ✅ API Route: /pages/api/user/update.js
import dbConnect from "@/lib/dbConnect";
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") return res.status(405).end();

  const { userId, name, location, avatar } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.location = location || user.location;
    user.avatar = avatar || user.avatar;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
}

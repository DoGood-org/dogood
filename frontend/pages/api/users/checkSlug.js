// /pages/api/users/checkSlug.js
import dbConnect from "@/lib/dbConnect";
import User from '@/models/User';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug || slug.length < 3) return res.status(400).json({ error: "Invalid slug" });

  await dbConnect();
  const existing = await User.findOne({ publicSlug: slug });
  res.json({ available: !existing });
}

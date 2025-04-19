import dbConnect from "@/lib/dbConnect";
import Deed from "@/models/Deed";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await dbConnect();
    const deeds = await Deed.find({}).sort({ createdAt: -1 });
    res.status(200).json(deeds);
  } catch (error) {
    console.error("GOOD DEEDS API ERROR:", error);
    res.status(500).json({ error: "Failed to load good deeds" });
  }
}

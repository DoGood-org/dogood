import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();
    console.log("REQ BODY:", req.body);

    const { from, to, content } = req.body;

    if (!from || !to || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newMessage = await Message.create({
      from,
      to,
      content,
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

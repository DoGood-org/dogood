
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await dbConnect();

    // Пример: получаем userId из заголовка или query (можно заменить на токен позже)
    const userId = req.query.userId || req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to load posts" });
  }
}

const { Parser } = require("json2csv");
const Post = require("../models/Post");

exports.exportPostsCSV = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).select("title content category urgency createdAt");

    const fields = ["title", "content", "category", "urgency", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(posts);

    res.header("Content-Type", "text/csv");
    res.attachment("myposts.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export posts", error: err.message });
  }
};

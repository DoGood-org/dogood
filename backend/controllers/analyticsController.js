const Post = require("../models/Post");
const User = require("../models/User");

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalPoints = await User.aggregate([{ $group: { _id: null, total: { $sum: "$points" } } }]);

    res.json({
      users: totalUsers,
      posts: totalPosts,
      points: totalPoints[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

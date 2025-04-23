const Post = require("../models/Post");
const User = require("../models/User");
const Volunteering = require("../models/Volunteering");
const GoodBotMessage = require("../models/GoodBotMessage");
const Deed = require("../models/Deed");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const postsByDate = await Post.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const volunteeringCount = await Volunteering.countDocuments({ user: userId });
    const volunteeringHours = volunteeringCount * 2;


    const donationAmount = 75;


    const deedsCount = await Deed.countDocuments({ user: userId });

    const botQuestions = await GoodBotMessage.countDocuments({ user: userId, role: "user" });

    const user = await User.findById(userId);
    const walletBalance = user?.wallet || 0;

    res.json({
      postsByDate: postsByDate.map((d) => ({ date: d._id, count: d.count })),
      volunteeringHours,
      donationAmount,
      deedsCount,
      botQuestions,
      walletBalance
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

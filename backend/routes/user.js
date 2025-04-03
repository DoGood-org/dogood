const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const { name, avatar, bio } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, avatar, bio },
        { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify", authMiddleware, async (req, res) => {
  const { organizationName, website, description } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          organization: {
            name: organizationName,
            website,
            description,
            verified: false,
          },
        },
        { new: true }
    ).select("-password");

    res.json({ message: "Verification request sent", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/points", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("points name");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ points: user.points || 0 });
  } catch (err) {
    console.error("Error getting user points:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Volunteering = require("../models/Volunteering");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newActivity = new Volunteering({
      user: req.user.id,
      title,
      description,
      date
    });

    await newActivity.save();
    res.status(201).json({ msg: "Activity created", activity: newActivity });
  } catch (err) {
    console.error("Create activity error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const activities = await Volunteering.find().populate("user", "name avatar");
    res.json(activities);
  } catch (err) {
    console.error("Fetch activities error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

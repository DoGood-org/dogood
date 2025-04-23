const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Request = require("../models/Request");

// GET /api/requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// POST /api/requests
router.post("/", auth, async (req, res) => {
  const { category, description, location, date } = req.body;
  if (!category || !description || !location || !date)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const request = await Request.create({
      user: req.user.id,
      category,
      description,
      location,
      date,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to create request" });
  }
});

module.exports = router;

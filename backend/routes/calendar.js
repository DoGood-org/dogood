// routes/calendar.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Event = require("../models/Event");

// GET /api/calendar - get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to load events" });
  }
});

// POST /api/calendar - add new event
router.post("/", auth, async (req, res) => {
  const { title, description, location, date, organizer, type } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required" });
  }

  try {
    const event = new Event({ title, description, location, date, organizer, type });
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event" });
  }
});

module.exports = router;

// routes/grants.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const grantSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  organization: String,
  link: String,
  createdAt: { type: Date, default: Date.now }
});

const Grant = mongoose.model("Grant", grantSchema);

// GET /api/grants - get all available grants
router.get("/", async (req, res) => {
  try {
    const list = await Grant.find().sort({ deadline: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to load grants" });
  }
});

// POST /api/grants - create a new grant (admin usage)
router.post("/", auth, async (req, res) => {
  const { title, description, deadline, organization, link } = req.body;
  if (!title || !description || !deadline) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const grant = new Grant({ title, description, deadline, organization, link });
    const saved = await grant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create grant" });
  }
});

module.exports = router;

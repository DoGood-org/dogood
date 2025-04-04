const express = require("express");
const router = express.Router();
const Deed = require("../models/Deed");

// GET /api/deeds
// Return all good deeds from the database
router.get("/", async (req, res) => {
  try {
    const deeds = await Deed.find().sort({ createdAt: -1 });
    res.json(deeds);
  } catch (err) {
    console.error("Failed to fetch deeds:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

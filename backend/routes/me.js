const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
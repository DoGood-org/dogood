const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users/:id
// Public profile info
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email avatar bio interests"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching public user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

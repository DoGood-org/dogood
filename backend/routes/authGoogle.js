const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Replace with frontend URL
    res.redirect("http://localhost:3000");
  }
);

module.exports = router;

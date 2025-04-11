const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createStripeSession } = require("../controllers/donationsController");

router.post("/create-session", auth, createStripeSession);

module.exports = router;

// routes/support.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { sendSupportEmail } = require("../utils/mailer");

const supportSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now }
});

const SupportTicket = mongoose.model("SupportTicket", supportSchema);

// GET /api/support - all tickets (for admins only)
router.get("/", async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

// POST /api/support - submit new support ticket + send email
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const ticket = new SupportTicket({ name, email, message });
    const saved = await ticket.save();

    try {
      await sendSupportEmail({ name, email, message });
    } catch (mailErr) {
      console.error("Email error:", mailErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit ticket" });
  }
});

module.exports = router;

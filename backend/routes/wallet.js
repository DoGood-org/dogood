const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Wallet = require("../models/Wallet");
const User = require("../models/User");

// GET /api/wallet - current user balance
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id });
      await wallet.save();
    }
    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error("Wallet GET error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/wallet/topup - add money
router.post("/topup", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ msg: "Invalid top-up amount" });
  }

  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id, balance: 0 });
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date();
    wallet.transactions.push({ type: "deposit", amount });

    await wallet.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 1 } });

    res.json({ msg: "Wallet updated", balance: wallet.balance });
  } catch (err) {
    console.error("Top-up error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

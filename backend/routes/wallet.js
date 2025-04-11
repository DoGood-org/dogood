// routes/wallet.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/wallet - return current user's wallet balance
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.wallet });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wallet balance" });
  }
});

// POST /api/wallet/topup - add amount to wallet
router.post("/topup", auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid top-up amount" });
  }

  try {
    const user = await User.findById(req.user.id);
    user.wallet += parseFloat(amount);
    user.transactions.push({ type: "Top-Up", amount: parseFloat(amount), date: new Date() });
    await user.save();
    res.json({ message: "Wallet topped up", balance: user.wallet });
  } catch (err) {
    res.status(500).json({ message: "Top-up failed" });
  }
});

// GET /api/wallet/transactions - return wallet history
router.get("/transactions", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// POST /api/wallet/withdraw - request withdrawal
router.post("/withdraw", auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.wallet < amount) return res.status(400).json({ message: "Insufficient balance" });

    user.wallet -= amount;
    user.transactions.push({ type: "Withdraw", amount: -amount, date: new Date() });
    await user.save();

    res.json({ message: "Withdrawal successful", balance: user.wallet });
  } catch (err) {
    res.status(500).json({ message: "Withdraw failed" });
  }
});

// POST /api/wallet/exchange - convert to karma points
router.post("/exchange", auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.wallet < amount) return res.status(400).json({ message: "Insufficient balance" });

    user.wallet -= amount;
    user.points += amount; // 1:1 ratio
    user.transactions.push({ type: "Exchange", amount: -amount, date: new Date() });
    await user.save();

    res.json({ message: "Exchanged to points", wallet: user.wallet, points: user.points });
  } catch (err) {
    res.status(500).json({ message: "Exchange failed" });
  }
});

module.exports = router;

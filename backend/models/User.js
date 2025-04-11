// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  wallet: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  theme: { type: String, default: "dark" },
  avatar: { type: String, default: "" },
  location: { type: String, default: "" },
  skills: { type: String, default: "" },
  googleId: { type: String, default: null },

  transactions: [
    {
      type: { type: String },
      amount: Number,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

// models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["level", "rank", "impact"], default: "level" },
  value: Number,
  icon: String,
  awardedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Achievement", achievementSchema);

const mongoose = require("mongoose");

const GoodBotMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  lang: { type: String, default: "en" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GoodBotMessage", GoodBotMessageSchema);

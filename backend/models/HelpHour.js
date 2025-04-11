// models/HelpHour.js
const mongoose = require("mongoose");

const helpHourSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: { type: String, required: true },
  organization: { type: String },
  hours: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model("HelpHour", helpHourSchema);

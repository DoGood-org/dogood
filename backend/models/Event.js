// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: { type: Date, required: true },
  organizer: String,
  type: { type: String, enum: ["csr", "volunteering", "internal"], default: "volunteering" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);

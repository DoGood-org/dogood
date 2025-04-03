const mongoose = require("mongoose");

const volunteeringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: String,
  location: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Volunteering", volunteeringSchema);

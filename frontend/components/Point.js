const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  name: String,
  description: String,
  lat: Number,
  lng: Number,
  type: String,
  images: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  },
});

pointSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Point", pointSchema);

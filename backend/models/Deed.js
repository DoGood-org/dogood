const mongoose = require("mongoose");

const DeedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deed", DeedSchema);

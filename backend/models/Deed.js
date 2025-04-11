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
// models/Deed.js
const mongoose = require("mongoose");

const deedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  hours: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});
module.exports = mongoose.model("Deed", deedSchema);
module.exports = mongoose.model("Deed", deedSchema);

// models/LearnMaterial.js
const mongoose = require("mongoose");

const learnMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "article", "course"], default: "article" },
  url: { type: String, required: true },
  description: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LearnMaterial", learnMaterialSchema);

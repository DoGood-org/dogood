const mongoose = require("mongoose");

const CSRSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String },
    description: { type: String },
    location: { type: String },
    category: { type: String },
    format: { type: String },
    time: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CSR", CSRSchema);

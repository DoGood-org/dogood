// routes/report.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Deed = require("../models/Deed");
const { Parser } = require("json2csv");

// GET /api/report/deeds - export user's deeds as CSV
router.get("/deeds", auth, async (req, res) => {
  try {
    const deeds = await Deed.find({ user: req.user.id });
    const fields = ["title", "description", "category", "hours", "date", "verified"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(deeds);

    res.header("Content-Type", "text/csv");
    res.attachment("deeds_report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
});

module.exports = router;

// routes/csr.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// In-memory CSR opportunities (demo only)
let csrOpportunities = [
  {
    id: 1,
    title: "Tree Planting with GreenTeam",
    description: "Join us in planting 500 trees across the city park",
    location: "Berlin",
    date: "2025-05-10",
    organization: "GreenTeam Initiative"
  },
  {
    id: 2,
    title: "Blood Donation Campaign",
    description: "Help save lives by donating blood.",
    location: "Munich",
    date: "2025-06-01",
    organization: "RedLife Org"
  }
];

// GET /api/csr - get all CSR opportunities
router.get("/", async (req, res) => {
  res.json(csrOpportunities);
});

// POST /api/csr - create a new CSR event (admin only)
router.post("/", auth, async (req, res) => {
  const { title, description, location, date, organization } = req.body;

  if (!title || !description || !location || !date || !organization) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newCsr = {
    id: csrOpportunities.length + 1,
    title,
    description,
    location,
    date,
    organization
  };

  csrOpportunities.push(newCsr);
  res.status(201).json(newCsr);
});

module.exports = router;

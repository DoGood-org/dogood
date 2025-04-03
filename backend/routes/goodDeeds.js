const express = require('express');
const router = express.Router();
const GoodDeed = require('../models/GoodDeed');
const authenticate = require('../middleware/authenticate');

// @route   GET /api/good-deeds
// @desc    Get current user's good deeds
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const deeds = await GoodDeed.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(deeds);
  } catch (error) {
    console.error('Error fetching good deeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

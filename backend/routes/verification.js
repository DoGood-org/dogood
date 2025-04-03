const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Verification = require('../models/Verification');
const User = require('../models/User');

router.post('/request', authMiddleware, async (req, res) => {
    try {
        const { document } = req.body;
        let verification = await Verification.findOne({ user: req.user.id });

        if (verification) return res.status(400).json({ msg: 'Request already sent' });

        verification = new Verification({
            user: req.user.id,
            document
        });

        await verification.save();
        res.json({ msg: 'Verification request sent' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.get('/requests', async (req, res) => {
    try {
        const requests = await Verification.find().populate('user', ['name', 'role']);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.post('/approve', authMiddleware, async (req, res) => {
    try {
        const { requestId, status, adminComment } = req.body;
        const verification = await Verification.findById(requestId);

        if (!verification) return res.status(404).json({ msg: 'Request not found' });

        verification.status = status;
        verification.adminComment = adminComment;
        await verification.save();

        if (status === 'approved') {
            const user = await User.findById(verification.user);
            user.verified = true;
            await user.save();
        }

        res.json({ msg: 'Verification status updated', verification });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

module.exports = router;

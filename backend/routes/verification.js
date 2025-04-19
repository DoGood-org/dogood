const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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


router.post("/email/verify", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const token = crypto.randomBytes(32).toString("hex");

        user.emailToken = token;
        user.emailTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h
        await user.save();

        const verifyUrl = `https://dogood-pink.vercel.app/verify?token=${token}`;
        const html = `<p>Click the link to verify your email:</p><p><a href='${verifyUrl}'>Verify Email</a></p>`;

        await sendEmail(user.email, "Verify your email", html);
        res.json({ message: "Verification email sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send verification email" });
    }
});


router.get("/email/confirm", async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({
            emailToken: token,
            emailTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }

        user.isEmailVerified = true;
        user.emailToken = undefined;
        user.emailTokenExpires = undefined;
        await user.save();

        res.send("✅ Email successfully verified.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error confirming email.");
    }
});

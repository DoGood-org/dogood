const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware JWT auth
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = { id: decoded.user.id }; // Normalized structure
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

// POST /api/register
router.post(
    "/register",
    [
        check("name", "Enter name").not().isEmpty(),
        check("email", "Enter a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        check("role", "Please provide a valid role").isIn(["donor", "volunteer", "ngo", "company"]),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "User already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                provider: "local"
            });

            await user.save();

            const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.json({ token });
        } catch (err) {
            console.error("Registration error:", err.message);
            res.status(500).json({ msg: "Server error" });
        }
    }
);

// POST /api/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.provider !== "local")
            return res.status(400).json({ msg: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// GET /api/me
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// POST /api/oauth
router.post("/oauth", async (req, res) => {
    const { provider, token } = req.body;

    try {
        if (provider === "google") {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, name, picture, sub } = payload;

            let user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name,
                    email,
                    avatar: picture,
                    role: "volunteer",
                    provider: "google"
                });
                await user.save();
            }

            const jwtPayload = { user: { id: user.id } };
            const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.json({ token: authToken });
        }

        // Future providers
        else if (provider === "facebook") {
            return res.status(501).json({ error: "Facebook login not implemented yet" });
        } else if (provider === "apple") {
            return res.status(501).json({ error: "Apple login not implemented yet" });
        } else {
            return res.status(400).json({ error: "Unsupported provider" });
        }
    } catch (err) {
        console.error("OAuth error:", err);
        res.status(500).json({ error: "OAuth login failed" });
    }
});

module.exports = router;

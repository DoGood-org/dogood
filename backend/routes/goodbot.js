const express = require("express");
const router = express.Router();
const GoodBotMessage = require("../models/GoodBotMessage");
const authMiddleware = require("../middleware/authMiddleware");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/goodbot/message
router.post("/message", authMiddleware, async (req, res) => {
    const { prompt, lang } = req.body;
    const userId = req.user._id;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const systemPrompt =
            lang === "ua"
                ? "Ти — доброзичливий помічник платформи добрих справ DoGood. Відповідай коротко, корисно і з позитивом."
                : "You are a helpful assistant of DoGood — a kindness platform. Answer briefly, positively, and clearly.";

        // Save user message
        await GoodBotMessage.create({
            user: userId,
            role: "user",
            content: prompt,
        });

        // Ask OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            max_tokens: 300,
        });

        const answer = completion.choices[0].message.content;

        // Save assistant reply
        await GoodBotMessage.create({
            user: userId,
            role: "assistant",
            content: answer,
        });

        res.json({ message: answer });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ message: "Bot error", error: err.message });
    }
});

// GET /api/goodbot/history
router.get("/history", authMiddleware, async (req, res) => {
    const userId = req.user._id;

    try {
        const history = await GoodBotMessage.find({ user: userId }).sort({ createdAt: 1 });
        res.json(
            history.map((m) => ({
                role: m.role,
                content: m.content,
                createdAt: m.createdAt,
            }))
        );
    } catch (err) {
        console.error("History load error:", err);
        res.status(500).json({ message: "Failed to load history" });
    }
});

// DELETE /api/goodbot/history
router.delete("/history", authMiddleware, async (req, res) => {
    const userId = req.user._id;

    try {
        await GoodBotMessage.deleteMany({ user: userId });
        res.json({ success: true });
    } catch (err) {
        console.error("Clear history error:", err);
        res.status(500).json({ message: "Failed to clear history" });
    }
});

module.exports = router;

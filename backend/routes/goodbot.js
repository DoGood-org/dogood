const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// API Route
router.post('/message', async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        res.json({ message: completion.choices[0].message.content });
    } catch (err) {
        console.error("Ошибка запроса к OpenAI:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

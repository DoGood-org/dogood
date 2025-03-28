const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

// Middleware для JWT
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "Нет токена" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Токен недействителен" });
    }
};

// ✅ Регистрация
router.post(
    "/register",
    [
        check("name", "Введите имя").not().isEmpty(),
        check("email", "Введите корректный email").isEmail(),
        check("password", "Пароль должен быть минимум 6 символов").isLength({ min: 6 }),
        check("role", "Укажите корректную роль").isIn(["donor", "volunteer", "ngo", "company"]),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "Пользователь уже существует" });

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword, role });
            await user.save();

            const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.json({ token });
        } catch (err) {
            console.error("Ошибка регистрации:", err.message);
            res.status(500).json({ msg: "Ошибка сервера" });
        }
    }
);

// ✅ Вход
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Неверный email или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Неверный email или пароль" });

        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

// ✅ Получить текущего пользователя
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "Пользователь не найден" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

module.exports = router;

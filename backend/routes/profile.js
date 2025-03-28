const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware проверки токена
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

// 📌 Обновить профиль
router.post("/update", authMiddleware, async (req, res) => {
  const { bio, interests } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Пользователь не найден" });

    user.bio = bio || "";
    user.interests = interests ? interests.split(",").map((i) => i.trim()) : [];
    await user.save();

    res.json({ msg: "Профиль обновлён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});
const multer = require("multer");
const path = require("path");

// Настройка загрузки
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
      cb(null, req.user.id + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 📌 Загрузка аватара
router.post("/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Пользователь не найден" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});

module.exports = router;

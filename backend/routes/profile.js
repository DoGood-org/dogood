const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Middleware: проверка JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Обновление имени и email
// PUT /api/profile
router.put("/", authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Обновление биографии и интересов
// POST /api/profile/update
router.post("/update", authMiddleware, async (req, res) => {
  const { bio, interests } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.bio = bio || "";
    user.interests = interests ? interests.split(",").map((i) => i.trim()) : [];

    await user.save();

    res.json({ msg: "Profile updated" });
  } catch (err) {
    console.error("Bio update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Загрузка аватара
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
      cb(null, req.user.id + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

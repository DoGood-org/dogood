// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `avatar_${req.user.id}_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// POST /api/upload/avatar
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const user = await User.findById(req.user.id);
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads", "avatars");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = req.user.id + "_" + Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    const filePath = `/uploads/avatars/${req.file.filename}`;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: filePath },
      { new: true }
    ).select("-password");

    res.json({ avatar: filePath, user: updated });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;

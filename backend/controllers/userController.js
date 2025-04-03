const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.avatar = req.file.path;
      await user.save();
      res.json({ avatar: user.avatar });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

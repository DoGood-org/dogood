const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar, getUserProfile } = require('../controllers/userController');
const {
    getWallet,
    getLeaderboard,
    getLocations,
    getCSRPrograms
} = require('../controllers/extraController');

// Маршруты для пользователя
router.post('/user/avatar', protect, uploadAvatar);
router.get('/user/profile', protect, getUserProfile);

// Новые маршруты
router.get('/wallet', protect, getWallet);
router.get('/gamification/leaderboard', protect, getLeaderboard);
router.get('/locations', protect, getLocations);
router.get('/csr', protect, getCSRPrograms);

module.exports = router;

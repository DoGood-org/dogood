const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { uploadAvatar, getUserProfile } = require('../controllers/userController');
const {
    getWallet,
    getLeaderboard,
    getLocations,
    getCSRPrograms
} = require('../controllers/extraController');

router.post('/user/avatar', authMiddleware, uploadAvatar);
router.get('/user/profile', authMiddleware, getUserProfile);

router.get('/wallet', authMiddleware, getWallet);
router.get('/gamification/leaderboard', authMiddleware, getLeaderboard);
router.get('/locations', authMiddleware, getLocations);
router.get('/csr', authMiddleware, getCSRPrograms);

module.exports = router;

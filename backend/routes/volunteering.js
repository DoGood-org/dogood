const express = require('express');
const router = express.Router();
const Initiative = require('../models/Initiative');

// 📌 Получение всех волонтёрских инициатив
router.get('/', async (req, res) => {
    const initiatives = await Initiative.find();
    res.json(initiatives);
});

module.exports = router;

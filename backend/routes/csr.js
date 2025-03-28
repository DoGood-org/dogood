const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const CSRProgram = require('../models/CSRProgram');
const User = require('../models/User');

// 📌 Создание CSR-программы (только для компаний)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'company') return res.status(403).json({ msg: 'Только компании могут создавать CSR-программы' });

        const { title, description, startDate, endDate } = req.body;
        const program = new CSRProgram({
            company: user._id,
            title,
            description,
            startDate,
            endDate
        });

        await program.save();
        res.json({ msg: 'CSR-программа создана', program });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

// 📌 Участие сотрудника в CSR-программе
router.post('/join', authMiddleware, async (req, res) => {
    try {
        const { programId } = req.body;
        const program = await CSRProgram.findById(programId);
        if (!program) return res.status(404).json({ msg: 'Программа не найдена' });

        if (!program.participants.includes(req.user.id)) {
            program.participants.push(req.user.id);
            await program.save();
        }

        res.json({ msg: 'Вы участвуете в программе', program });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

// 📌 Получение всех CSR-программ
router.get('/', async (req, res) => {
    try {
        const programs = await CSRProgram.find().populate('company', ['name']);
        res.json(programs);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

// 📌 Пополнение баланса
router.post('/topup', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ msg: 'Некорректная сумма' });

        let wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) wallet = new Wallet({ user: req.user.id });

        wallet.balance += amount;
        wallet.transactions.push({ type: 'deposit', amount });

        await wallet.save();
        res.json({ msg: 'Баланс пополнен', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Пожертвование
router.post('/donate', authMiddleware, async (req, res) => {
    try {
        const { amount, recipientId } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ msg: 'Некорректная сумма' });

        let senderWallet = await Wallet.findOne({ user: req.user.id });
        if (!senderWallet || senderWallet.balance < amount) return res.status(400).json({ msg: 'Недостаточно средств' });

        let recipientWallet = await Wallet.findOne({ user: recipientId });
        if (!recipientWallet) recipientWallet = new Wallet({ user: recipientId });

        senderWallet.balance -= amount;
        recipientWallet.balance += amount;

        senderWallet.transactions.push({ type: 'donation', amount, recipient: recipientId });
        recipientWallet.transactions.push({ type: 'deposit', amount });

        await senderWallet.save();
        await recipientWallet.save();

        res.json({ msg: 'Пожертвование отправлено' });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

// 📌 Получение информации о кошельке
router.get('/', authMiddleware, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user.id }) || new Wallet({ user: req.user.id, balance: 0 });
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
});

module.exports = router;

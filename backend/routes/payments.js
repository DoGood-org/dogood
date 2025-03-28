const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const authMiddleware = require('../middleware/authMiddleware');
const Wallet = require('../models/Wallet');

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// 📌 Пополнение баланса через Stripe
router.post('/stripe', authMiddleware, async (req, res) => {
    try {
        const { amount, token } = req.body;

        const charge = await stripe.charges.create({
            amount: amount * 100, // Сумма в центах
            currency: 'usd',
            source: token,
            description: 'Пополнение DoGood Wallet'
        });

        let wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) wallet = new Wallet({ user: req.user.id });

        wallet.balance += amount;
        wallet.transactions.push({ type: 'deposit', amount });

        await wallet.save();
        res.json({ msg: 'Пополнение успешно', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка платежа через Stripe', error: error.message });
    }
});

// 📌 Пополнение баланса через PayPal
router.post('/paypal', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        const create_payment_json = {
            intent: 'sale',
            payer: { payment_method: 'paypal' },
            transactions: [{
                amount: { currency: 'USD', total: amount },
                description: 'Пополнение DoGood Wallet'
            }],
            redirect_urls: {
                return_url: 'http://localhost:5000/api/payments/paypal/success',
                cancel_url: 'http://localhost:5000/api/payments/paypal/cancel'
            }
        };

        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) return res.status(500).json({ msg: 'Ошибка PayPal', error });

            res.json({ approval_url: payment.links.find(link => link.rel === 'approval_url').href });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка платежа через PayPal', error: error.message });
    }
});

// 📌 Подтверждение PayPal-платежа
router.get('/paypal/success', authMiddleware, async (req, res) => {
    try {
        const { paymentId, PayerID } = req.query;

        paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
            if (error) return res.status(500).json({ msg: 'Ошибка подтверждения платежа', error });

            const amount = parseFloat(payment.transactions[0].amount.total);

            let wallet = await Wallet.findOne({ user: req.user.id });
            if (!wallet) wallet = new Wallet({ user: req.user.id });

            wallet.balance += amount;
            wallet.transactions.push({ type: 'deposit', amount });

            await wallet.save();
            res.redirect('http://localhost:3000/wallet');
        });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка при подтверждении PayPal', error: error.message });
    }
});

module.exports = router;

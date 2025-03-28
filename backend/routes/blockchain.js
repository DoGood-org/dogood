const express = require('express');
const router = express.Router();
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// 📌 Проверка транзакции на блокчейне
router.get('/transaction/:txHash', async (req, res) => {
    try {
        const { txHash } = req.params;
        const transaction = await web3.eth.getTransaction(txHash);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка при проверке транзакции', error: error.message });
    }
});

module.exports = router;

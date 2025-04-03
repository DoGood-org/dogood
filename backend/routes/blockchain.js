const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Web3Import = require("web3");

const Web3 = Web3Import.Web3;

// Replace this with your real Infura project ID
const INFURA_PROJECT_ID = "YOUR_INFURA_PROJECT_ID";
const web3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);

// Example route to get ETH balance
router.get("/balance/:address", authMiddleware, async (req, res) => {
    const address = req.params.address;

    if (!web3.utils.isAddress(address)) {
        return res.status(400).json({ msg: "Invalid Ethereum address" });
    }

    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");

        res.json({ address, balance: balanceEth });
    } catch (error) {
        console.error("Blockchain error:", error.message);
        res.status(500).json({ msg: "Failed to fetch balance" });
    }
});

module.exports = router;

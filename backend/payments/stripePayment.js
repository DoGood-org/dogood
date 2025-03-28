const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd"
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPaymentIntent };
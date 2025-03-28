import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

export default function Wallet() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const authToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!authToken) return;
        fetch("http://localhost:5000/api/wallet", {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then((res) => res.json())
            .then((data) => setBalance(data.balance))
            .catch(console.error);
    }, [authToken]);

    const handleTopUp = (stripeToken) => {
        fetch("http://localhost:5000/api/payments/stripe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ amount: parseFloat(amount), token: stripeToken.id }),
        })
            .then((res) => res.json())
            .then(() => setBalance((prev) => prev + parseFloat(amount)))
            .catch(console.error);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
            <h1 className="text-4xl font-bold text-gray-900">Ваш кошелек</h1>
            <p className="mt-4 text-2xl text-gray-700">Баланс: <span className="font-bold text-primary">{balance} USD</span></p>
            <div className="mt-6 space-x-4">
                <input
                    type="number"
                    placeholder="Сумма"
                    className="border rounded-md px-4 py-2"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <StripeCheckout
                    stripeKey="pk_test_your_stripe_public_key"
                    token={handleTopUp}
                    amount={amount * 100}
                    currency="USD"
                >
                    <button className="bg-accent text-white px-6 py-3 rounded-md text-lg shadow-md hover:bg-green-600 transition">
                        Пополнить
                    </button>
                </StripeCheckout>
            </div>
        </div>
    );
}

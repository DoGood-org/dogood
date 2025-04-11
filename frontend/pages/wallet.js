// pages/wallet.js
import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import Toast from "@/components/Toast";

export default function Wallet() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const [transactions, setTransactions] = useState([]);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Load wallet balance and transactions
    useEffect(() => {
        if (!token) return;
        fetch("/api/wallet", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setBalance(data.balance || 0))
            .catch(() => setToast({ message: "Failed to load wallet balance", type: "error" }));

        fetch("/api/wallet/transactions", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setTransactions(data || []));
    }, []);

    // Stripe top-up handler
    const handleStripeToken = async (stripeToken) => {
        try {
            const res = await fetch("/api/wallet/topup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: stripeToken, amount }),
            });

            if (!res.ok) throw new Error("Top-up failed");
            const data = await res.json();
            setToast({ message: `Top-up of $${amount} successful`, type: "success" });
            setBalance((prev) => prev + parseFloat(amount));
            setAmount("");
        } catch (err) {
            setToast({ message: err.message, type: "error" });
        }
    };

    const handleWithdraw = () => {
        setToast({ message: "Withdraw feature coming soon", type: "info" });
    };

    const handleExchange = () => {
        setToast({ message: "Exchange feature coming soon", type: "info" });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">My Wallet</h1>

            <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl space-y-6">
                {/* Balance Display */}
                <div className="text-center">
                    <p className="text-lg">Current Balance:</p>
                    <p className="text-4xl font-bold text-teal-400">${balance.toFixed(2)}</p>
                </div>

                {/* Top-up Form */}
                <div>
                    <label className="block mb-2 font-medium">Top-Up Amount ($)</label>
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 text-black rounded"
                    />
                    <StripeCheckout
                        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
                        token={handleStripeToken}
                        name="Top up Wallet"
                        amount={parseFloat(amount) * 100}
                        currency="USD"
                        email="donor@example.com"
                    >
                        <button
                            className="mt-4 w-full bg-teal-500 text-black py-2 rounded hover:bg-teal-400 transition"
                        >
                            Top Up via Stripe
                        </button>
                    </StripeCheckout>
                </div>

                {/* Wallet Actions */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <button
                        onClick={handleWithdraw}
                        className="flex-1 bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={handleExchange}
                        className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-500"
                    >
                        Exchange
                    </button>
                </div>

                {/* Transaction History */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
                    {transactions.length === 0 ? (
                        <p className="text-sm text-gray-400">No transactions yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {transactions.map((tx, i) => (
                                <li key={i} className="flex justify-between text-sm bg-gray-700 p-2 rounded">
                                    <span>{tx.date}</span>
                                    <span>{tx.type}</span>
                                    <span className={tx.amount > 0 ? "text-green-400" : "text-red-400"}>
                    ${tx.amount.toFixed(2)}
                  </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Toast Message */}
                {toast.message && <Toast message={toast.message} type={toast.type} />}
            </div>
        </div>
    );
}
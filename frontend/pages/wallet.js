import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import Toast from "../components/Toast";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("http://localhost:5000/api/wallet", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => setBalance(data.balance || 0))
        .catch(() => setToast({ message: "Failed to load wallet balance", type: "error" }));
  }, []);

  const handleTopup = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setToast({ message: "Enter a valid amount", type: "error" });
      return;
    }
    // Logic to process payment here
    setToast({ message: `Top-up of $${num} simulated`, type: "success" });
    setBalance((prev) => prev + num);
    setAmount("");
  };

  return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Wallet</h1>

        <div className="bg-white rounded shadow-md p-6 space-y-6">
          <div>
            <p className="text-gray-700 text-lg">Current Balance:</p>
            <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Top-Up Amount ($)</label>
            <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
            />

            <button
                onClick={handleTopup}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Top Up
            </button>
          </div>

          {/* Stripe logic placeholder */}
          {/*
        <StripeCheckout
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
          token={onToken}
          name="Top up Wallet"
          amount={amount * 100}
        />
        */}

          {toast.message && (
              <Toast message={toast.message} type={toast.type} />
          )}
        </div>
      </div>
  );
}

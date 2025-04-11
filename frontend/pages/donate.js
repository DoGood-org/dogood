// pages/donate.js
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function DonatePage() {
  const [form, setForm] = useState({ amount: '', interval: 'once', method: 'card' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Donation failed');

      setSuccess(true);
      setForm({ amount: '', interval: 'once', method: 'card' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Donate to DoGood</h1>

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <input
              type="number"
              name="amount"
              placeholder="Amount (EUR)"
              required
              value={form.amount}
              onChange={handleChange}
              className="w-full p-3 text-black rounded"
          />

          <select
              name="interval"
              value={form.interval}
              onChange={handleChange}
              className="w-full p-3 text-black rounded"
          >
            <option value="once">One-time</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="w-full p-3 text-black rounded"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Cryptocurrency</option>
          </select>

          <button
              type="submit"
              className="bg-teal-400 text-black px-6 py-2 rounded hover:bg-teal-300"
          >
            Donate Now
          </button>
        </form>

        {/* Feedback messages */}
        {success && <p className="mt-4 text-green-400">Thank you for your donation!</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* QR Code donation section */}
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold mb-2">Quick Donate via QR</h2>
          <QRCodeSVG
              value="https://dogood.org/donate"
              size={160}
              fgColor="#00FFC8"
              bgColor="#111827"
          />
        </div>
      </div>
  );
}

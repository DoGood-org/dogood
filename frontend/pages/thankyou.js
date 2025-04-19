"use client";

// pages/thankyou.js
import { useState, useEffect } from 'react';
import ThankYouCard from '@/components/ThankYouCard';

export default function ThankYouPage() {
  const [form, setForm] = useState({ to: '', message: '', emoji: '' });
  const [thankYous, setThankYous] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const emojis = ['🙏', '💖', '🌟', '👏', '😊'];

  useEffect(() => {
    fetch('/api/thankyou')
        .then((res) => res.json())
        .then((data) => setThankYous(data || []));
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/thankyou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit thank you');
      setForm({ to: '', message: '', emoji: '' });
      setSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Send a Thank You</h1>

        {/* Thank You Form */}
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <input
              name="to"
              placeholder="To (name or organization)"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              required
              className="w-full p-3 text-black rounded"
          />
          <textarea
              name="message"
              placeholder="Write your thank you message..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              required
              className="w-full p-3 text-black rounded"
          />

          <div>
            <p className="mb-2">Choose an emoji:</p>
            <div className="flex gap-2">
              {emojis.map((e) => (
                  <button
                      type="button"
                      key={e}
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={`text-3xl p-2 rounded ${form.emoji === e ? 'bg-teal-500 text-black' : 'bg-gray-800'}`}
                  >
                    {e}
                  </button>
              ))}
            </div>
          </div>

          <button
              type="submit"
              className="bg-teal-400 text-black px-6 py-2 rounded hover:bg-teal-300"
          >
            Send Thank You
          </button>
        </form>

        {/* Shared Thank Yous */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Shared Thank Yous</h2>
          {thankYous.length === 0 ? (
              <p className="text-gray-400">No thank yous yet.</p>
          ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {thankYous.map((thank, i) => (
                    <ThankYouCard key={i} thank={thank} />
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
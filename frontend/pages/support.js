"use client";

// pages/support.js
import { useState } from 'react';
import Toast from '@/components/Toast';
import Link from 'next/link';

export default function SupportPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed to submit support ticket');
            setToast({ message: 'Support ticket submitted successfully!', type: 'success' });
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Support</h1>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 text-black rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 text-black rounded"
                    />
                    <textarea
                        name="message"
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        required
                        className="w-full p-3 text-black rounded"
                    />
                    <button
                        type="submit"
                        className="bg-teal-500 text-black px-6 py-2 rounded hover:bg-teal-400"
                    >
                        Submit Ticket
                    </button>
                    {toast && <Toast message={toast.message} type={toast.type} />}
                </form>

                {/* FAQ or Live Chat */}
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Need Live Help?</h2>
                    <p className="mb-4 text-gray-300">
                        If your issue is urgent or you'd like to speak with GoodBot, you can start a live chat.
                    </p>
                    <Link
                        href="/chat"
                        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
                    >
                        Open Live Chat
                    </Link>
                </div>
            </div>
        </div>
    );
}

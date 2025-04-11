// pages/future.js
import { useState } from 'react';

export default function FuturePage() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('AR/VR Beta Interest:', form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Future: AR/VR & Innovation</h1>

        <div className="bg-gray-800 p-6 rounded-xl mb-10">
          <h2 className="text-xl font-semibold mb-2">What We Imagine</h2>
          <p className="text-lg mb-4">
            Imagine attending a virtual beach cleanup, mentoring someone in a virtual café, or walking through a 3D kindness museum.
            Our vision brings DoGood into AR/VR — immersive, engaging and global.
          </p>
          <a
            href="/presentations/DoGood_VR_Concept.pdf"
            className="inline-block mt-4 px-6 py-2 bg-teal-500 text-black rounded hover:bg-teal-400"
            download
          >
            Download Concept PDF
          </a>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-purple-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Join the Beta Program</h2>
            <input
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 text-black rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 text-black rounded"
            />
            <button className="bg-white text-purple-800 font-semibold px-6 py-2 rounded hover:bg-purple-100">
              Sign Up for Beta
            </button>
          </form>
        ) : (
          <div className="text-center text-green-400 bg-purple-900 p-6 rounded-xl">
            <p className="text-xl">🎉 You're on the beta list!</p>
            <p className="text-sm mt-1">We'll contact you soon with updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// pages/my-deeds.js
import { useEffect, useState } from 'react';

export default function MyDeeds() {
    const [deeds, setDeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('/api/my-deeds', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setDeeds(data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">My Good Deeds</h1>

            {loading ? (
                <p className="text-gray-400">Loading your deeds...</p>
            ) : deeds.length === 0 ? (
                <p className="text-gray-400">You haven't recorded any good deeds yet.</p>
            ) : (
                <div className="space-y-4">
                    {deeds.map((deed, i) => (
                        <div key={i} className="bg-gray-800 p-4 rounded-xl shadow">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold">{deed.title}</h2>
                                <span className="text-sm text-gray-400">{new Date(deed.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-teal-400 mb-1">Category: {deed.category}</p>
                            <p className="mb-3">{deed.description}</p>
                            <div className="flex gap-3">
                                <button className="bg-purple-500 text-black px-3 py-1 rounded hover:bg-purple-400 text-sm">
                                    Share
                                </button>
                                <button className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 text-sm">
                                    Upload Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

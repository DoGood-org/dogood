
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyGoodDeeds = () => {
    const [deeds, setDeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

    useEffect(() => {
        const fetchDeeds = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/good-deeds`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setDeeds(response.data);
            } catch (err) {
                setError('Failed to load your good deeds.');
            } finally {
                setLoading(false);
            }
        };

        fetchDeeds();
    }, []);

    if (loading) return <div>Loading your good deeds...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (deeds.length === 0) return <div>You haven’t logged any good deeds yet.</div>;

    return (
        <div className="space-y-4">
            {deeds.map((deed) => (
                <div
                    key={deed._id}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                >
                    <h2 className="text-lg font-semibold">{deed.title}</h2>
                    <p className="text-sm text-gray-600">{deed.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(deed.date).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default MyGoodDeeds;

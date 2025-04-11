// pages/achievements.js
import { useState } from 'react';

const sampleData = {
    donations: [
        { name: 'Alice', value: 320 },
        { name: 'John', value: 250 },
        { name: 'Sara', value: 190 },
    ],
    volunteering: [
        { name: 'Carlos', value: 40 },
        { name: 'Lina', value: 36 },
        { name: 'Omar', value: 30 },
    ],
    lives: [
        { name: 'Emma', value: 5 },
        { name: 'Ben', value: 4 },
        { name: 'Nina', value: 3 },
    ]
};

export default function AchievementsPage() {
    const [tab, setTab] = useState('donations');

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Achievements & Leaderboards</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                {['donations', 'volunteering', 'lives'].map((key) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`${tab === key ? 'border-b-2 border-teal-400 font-semibold' : 'text-gray-400'}`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>

            {/* Leaderboard */}
            <div className="space-y-3 mb-10">
                {sampleData[tab].map((entry, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-xl flex justify-between">
                        <span>{index + 1}. {entry.name}</span>
                        <span className="text-teal-300 font-bold">
              {tab === 'donations' ? `€${entry.value}` : tab === 'volunteering' ? `${entry.value}h` : `${entry.value} lives`}
            </span>
                    </div>
                ))}
            </div>

            {/* Badges & Share */}
            <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">Your Kindness Level</h2>
                <p className="text-teal-400 font-bold text-2xl mb-4">Compassion Hero 🏅</p>
                <p>You’ve earned 3 badges for volunteering and community impact.</p>

                <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-400">
                    Share Your Impact
                </button>
            </div>
        </div>
    );
}

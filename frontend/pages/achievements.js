import { useEffect, useState } from 'react';

export default function Achievements() {
  const [leaderboard, setLeaderboard] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/gamification/leaderboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(setLeaderboard)
        .catch(console.error);
  }, [token]);

  return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Top Contributors</h1>

        <div className="space-y-3">
          {leaderboard.map((user, index) => (
              <div
                  key={user._id}
                  className="p-4 bg-white rounded shadow-md flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold">#{index + 1} {user.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.totalDonations} USD donated &middot; {user.volunteeringHours}h volunteered
                  </p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

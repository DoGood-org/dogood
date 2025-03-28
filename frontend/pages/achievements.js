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
    <div>
      <h1>Лидерборд</h1>
      {leaderboard.map((user, index) => (
        <div key={user._id}>
          <p>#{index + 1} {user.user.name} - {user.totalDonations} USD, {user.volunteeringHours} ч.</p>
        </div>
      ))}
    </div>
  );
}

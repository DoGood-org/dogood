
import { useEffect, useState } from "react";

export default function Achievements() {
  const [points, setPoints] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch points
    fetch("http://localhost:5000/api/user/points", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setPoints(data.points || 0))
      .catch(() => setPoints(0));

    // Fetch posts
    fetch("http://localhost:5000/api/posts/mine", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]));
  }, []);

  const earnedBadges = [];

  if (points >= 100) earnedBadges.push("💯 100 Points Club");
  if (points >= 500) earnedBadges.push("🔥 500 Points Master");
  if (posts.length >= 1) earnedBadges.push("📝 First Post");
  if (posts.length >= 5) earnedBadges.push("📚 5 Posts");

  return (
    <div className="p-4 mt-4 border rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-3">🏅 Achievements</h2>
      {earnedBadges.length > 0 ? (
        <ul className="space-y-2">
          {earnedBadges.map((badge, i) => (
            <li key={i} className="bg-green-100 p-2 rounded">{badge}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No achievements yet. Keep going!</p>
      )}
    </div>
  );
}

import { API_URL } from "@/config";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";

export default function ActivityCalendar() {
  const [activityMap, setActivityMap] = useState({});
  const [showPosts, setShowPosts] = useState(true);
  const [showVolunteering, setShowVolunteering] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchActivity = async () => {
      const map = {};

      const countDate = (dateStr) => {
        const date = format(new Date(dateStr), "yyyy-MM-dd");
        map[date] = (map[date] || 0) + 1;
      };

      try {
        if (showPosts) {
          const postRes = await fetch("API_URL/api/posts/mine", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const posts = await postRes.json();
          posts.forEach((p) => countDate(p.createdAt));
        }

        if (showVolunteering) {
          const volRes = await fetch("API_URL/api/volunteering", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const vols = await volRes.json();
          vols.forEach((v) => countDate(v.createdAt));
        }

        setActivityMap(map);
      } catch (err) {
        console.error("Error loading activity data:", err);
      }
    };

    if (token) fetchActivity();
  }, [showPosts, showVolunteering]);

  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const key = format(date, "yyyy-MM-dd");
    return {
      date: key,
      count: activityMap[key] || 0,
    };
  });

  const getColor = (count) => {
    if (count === 0) return "bg-gray-200";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    return "bg-green-600";
  };

  return (
      <div className="p-4 mt-6 border rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-3">📆 Activity Calendar</h2>

        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                checked={showPosts}
                onChange={() => setShowPosts(!showPosts)}
            />
            <span>Show Posts</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                checked={showVolunteering}
                onChange={() => setShowVolunteering(!showVolunteering)}
            />
            <span>Show Volunteering</span>
          </label>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {days.map((day, i) => (
              <div
                  key={i}
                  className={\`w-6 h-6 rounded \${getColor(day.count)}\`}
            title={\`\${day.date}: \${day.count} actions\`}
          ></div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StatisticsCard({ userId }) {
  const [stats, setStats] = useState({
    totalDeeds: 0,
    totalHelpHours: 0,
    activityByDate: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/stats/user/6802795706d4042e7089949a`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    if (userId) fetchStats();
  }, [userId]);

  const activityData = Object.entries(stats.activityByDate).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-6 text-white">
      <h3 className="text-xl font-bold mb-2">My Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-teal-700 p-3 rounded text-center">
          <p className="text-2xl font-bold">{stats.totalDeeds}</p>
          <p className="text-sm">Good Deeds</p>
        </div>
        <div className="bg-green-600 p-3 rounded text-center">
          <p className="text-2xl font-bold">{stats.totalHelpHours}</p>
          <p className="text-sm">Help Hours</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

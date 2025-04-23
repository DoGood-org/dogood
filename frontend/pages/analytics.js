import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-6">Loading analytics...</div>;

  const lineChart = {
    labels: data.postsByDate.map((item) => item.date),
    datasets: [
      {
        label: "Posts",
        data: data.postsByDate.map((item) => item.count),
        fill: false,
        borderColor: "teal",
        tension: 0.2,
      },
    ],
  };

  const pieChart = {
    labels: ["Volunteering", "Donations", "Deeds", "Bot Questions"],
    datasets: [
      {
        data: [
          data.volunteeringHours,
          data.donationAmount,
          data.deedsCount,
          data.botQuestions,
        ],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 My Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Posts Over Time</h2>
          <Line data={lineChart} />
        </div>

        <div className="bg-white rounded p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Activity Breakdown</h2>
          <Pie data={pieChart} />
        </div>
      </div>

      <div className="mt-8 max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <ul className="space-y-2">
          <li>🕒 Volunteering hours: <b>{data.volunteeringHours}</b></li>
          <li>💰 Total donations: <b>${data.donationAmount}</b></li>
          <li>❤️ Good deeds: <b>{data.deedsCount}</b></li>
          <li>🤖 GoodBot queries: <b>{data.botQuestions}</b></li>
          <li>📬 Wallet balance: <b>${data.walletBalance}</b></li>
        </ul>
      </div>
    </div>
  );
}

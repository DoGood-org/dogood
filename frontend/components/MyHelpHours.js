import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function MyHelpHours() {
  const [hours, setHours] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/volunteering`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
          setHours(data);
          const totalHours = data.reduce((sum, item) => sum + (item.hours || 2), 0);
          setTotal(totalHours);
        });
  }, []);

  const groupByDate = () => {
    const result = {};
    hours.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString();
      result[date] = (result[date] || 0) + (item.hours || 2);
    });
    return result;
  };

  const groupByType = () => {
    const result = {};
    hours.forEach((item) => {
      const t = item.type || "volunteer";
      result[t] = (result[t] || 0) + (item.hours || 2);
    });
    return result;
  };

  const dataByDate = groupByDate();
  const dataByType = groupByType();

  return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">My Volunteer Hours</h2>
        <p>Total: <strong>{total}</strong> hours</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-semibold mb-2">Hours Over Time</h3>
            <Line
                data={{
                  labels: Object.keys(dataByDate),
                  datasets: [
                    {
                      label: "Hours",
                      data: Object.values(dataByDate),
                      fill: false,
                      borderColor: "teal",
                      tension: 0.3,
                    },
                  ],
                }}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-semibold mb-2">Activity Types</h3>
            <Pie
                data={{
                  labels: Object.keys(dataByType),
                  datasets: [
                    {
                      label: "Types",
                      data: Object.values(dataByType),
                      backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
                    },
                  ],
                }}
            />
          </div>
        </div>

        <div className="bg-white mt-6 p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-3">Event List</h3>
          <table className="w-full text-sm">
            <thead>
            <tr className="text-left border-b">
              <th className="py-1">Date</th>
              <th className="py-1">Description</th>
              <th className="py-1">Hours</th>
              <th className="py-1">Type</th>
            </tr>
            </thead>
            <tbody>
            {hours.map((item, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-1">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="py-1">{item.description}</td>
                  <td className="py-1">{item.hours || 2}</td>
                  <td className="py-1">{item.type || "volunteer"}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

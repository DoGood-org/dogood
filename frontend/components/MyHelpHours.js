
import { useEffect, useState } from 'react';

export default function MyHelpHours() {
  const [hours, setHours] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/my-hours`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch help hours");
        setHours(data.total || 0);
        setRecords(data.records || []);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-white">My Help Hours</h2>

      {loading ? (
        <p className="text-gray-400">Loading help hours...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <p className="text-4xl font-bold text-teal-400 mb-6">{hours} hours</p>

          {records.length === 0 ? (
            <p className="text-gray-400">No volunteering records yet.</p>
          ) : (
            <ul className="space-y-3">
              {records.map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-700 p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.date}</p>
                  </div>
                  <div className="text-teal-300 font-bold">+{item.hours}h</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

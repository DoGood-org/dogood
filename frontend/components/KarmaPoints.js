import { API_URL } from "@/config";
import { useEffect, useState } from "react";

export default function KarmaPoints() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch("API_URL/api/user/points", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPoints(data.points || 0);
        } else {
          setPoints(0);
        }
      } catch {
        setPoints(0);
      }
    };

    fetchPoints();
  }, []);

  return (
      <div className="text-center my-4 bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">🌟 My Karma Points</h3>
        <p className="text-3xl font-bold text-green-600">{points}</p>
      </div>
  );
}

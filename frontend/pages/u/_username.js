
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PublicPassport() {
  const router = useRouter();
  const { username } = router.query;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    fetch(`/api/users/${username}/passport`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setData)
      .catch(() => setError("User not found or profile is private."));
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading passport...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={data.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-teal-500"
          />
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-teal-300">{data.city}</p>
            <p className="text-sm text-gray-400">Joined: {new Date(data.joinedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {data.bio && (
          <div>
            <h2 className="text-xl font-semibold mb-1">About</h2>
            <p className="text-gray-300">{data.bio}</p>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-2">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Good Deeds" value={data.stats.totalDeeds} />
            <StatCard label="Thank Yous" value={data.stats.totalThanks} />
            <StatCard label="Hours" value={data.stats.hours} />
            <StatCard label="Karma" value={data.stats.karma} />
          </div>
        </div>

        {data.goodDeeds.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-4">Good Deeds</h2>
            <ul className="space-y-2">
              {data.goodDeeds.map((deed, i) => (
                <li key={i} className="bg-gray-700 p-3 rounded text-sm">
                  <span className="text-teal-400">{deed.type}</span>: {deed.title}{" "}
                  <span className="text-gray-400 text-xs float-right">{new Date(deed.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.thanks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-4">Thank Yous</h2>
            <ul className="space-y-2">
              {data.thanks.map((t, i) => (
                <li key={i} className="bg-gray-700 p-3 rounded text-sm italic">
                  “{t.message}” — <span className="text-teal-400">{t.from}</span>{" "}
                  <span className="text-gray-400 text-xs float-right">{new Date(t.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-700 text-center p-4 rounded">
      <div className="text-2xl font-bold text-teal-400">{value}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}

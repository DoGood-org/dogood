import { useEffect, useState } from "react";

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/badges`, {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then((res) => res.json())
        .then(setAllBadges);

    fetch(`${process.env.NEXT_PUBLIC_API}/badges/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then((res) => res.json())
        .then((data) => setUserBadges(data.map((b) => b.badgeId?._id)));
  }, []);

  const isEarned = (badgeId) => userBadges.includes(badgeId);

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Your Badges</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allBadges.map((badge) => {
            const earned = isEarned(badge._id);
            return (
                <div
                    key={badge._id}
                    className={`p-4 rounded-xl bg-gray-800 ${!earned && "opacity-50"} relative`}
                >
                  <img
                      src={badge.icon || "/badges/default.png"}
                      alt={badge.title}
                      className="w-full h-40 object-contain rounded mb-3"
                  />
                  <h2 className="text-xl font-semibold mb-1">{badge.title}</h2>
                  <p className="text-sm mb-3">{badge.description}</p>

                  {earned ? (
                      <div className="flex gap-2">
                        <button className="bg-teal-500 text-black px-3 py-1 rounded hover:bg-teal-400 text-sm">
                          Mint as NFT
                        </button>
                        <button className="bg-purple-500 text-black px-3 py-1 rounded hover:bg-purple-400 text-sm">
                          Share
                        </button>
                      </div>
                  ) : (
                      <p className="text-xs text-gray-400 italic">Locked</p>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
}

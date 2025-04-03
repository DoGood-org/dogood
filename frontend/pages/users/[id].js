import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PublicProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      }
    };

    fetchUser();
  }, [id]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 text-center">
        {user.avatar && (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full mx-auto mb-4"
          />
        )}

        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>

        {user.bio && (
          <p className="italic text-gray-700 mb-4">&quot;{user.bio}&quot;</p>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {user.interests.map((interest, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
              >
                #{interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

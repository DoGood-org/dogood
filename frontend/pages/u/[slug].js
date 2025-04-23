import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PublicProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const [user, setUser] = useState(null);
  const [deeds, setDeeds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/users/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        fetch(`${process.env.NEXT_PUBLIC_API}/deeds/user/${data._id}`)
          .then((res) => res.json())
          .then(setDeeds)
          .catch(() => setDeeds([]));
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <div className="p-6 text-red-600">User not found</div>;
  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
              {user.name?.[0] || "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">@{user.slug}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Bio</h2>
          <p className="text-gray-800">{user.bio || "No bio provided."}</p>
        </div>

        {deeds.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Good Deeds</h2>
            <ul className="space-y-2">
              {deeds.map((deed) => (
                <li key={deed._id} className="p-3 border rounded">
                  <p className="font-semibold">{deed.title}</p>
                  <p className="text-sm text-gray-500">{deed.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4">
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

import { API_URL } from "@/config";

import { useEffect, useState } from "react";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("API_URL/api/friends/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setFriends(data);
        }
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };

    fetchFriends();
  }, []);

  return (
      <div className="p-4 mt-6 border rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-3">👥 My Friends</h2>
        {friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map((friend) => (
                  <li key={friend._id} className="flex items-center space-x-3 bg-gray-50 p-2 rounded">
                    <img
                        src={friend.avatar || "/default-avatar.png"}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">{friend.name}</span>
                  </li>
              ))}
            </ul>
        ) : (
            <p className="text-gray-500">You have no friends yet.</p>
        )}
      </div>
  );
}

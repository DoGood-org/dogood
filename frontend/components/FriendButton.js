import { API_URL } from "@/config";

import { useEffect, useState } from "react";

export default function FriendButton({ targetUserId }) {
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const res = await fetch(`${API_URL}/api/friends/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const friendIds = data.map((f) => f._id);
        setIsFriend(friendIds.includes(targetUserId));
      } catch (err) {
        console.error("Error fetching friends list:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && targetUserId) checkFriendship();
  }, [targetUserId]);

  const handleToggle = async () => {
    const method = isFriend ? "DELETE" : "POST";
    try {
      const res = await fetch(
          `API_URL/api/friends/${isFriend ? "remove" : "add"}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ friendId: targetUserId }),
          }
      );
      if (res.ok) {
        setIsFriend(!isFriend);
      }
    } catch (err) {
      console.error("Friend toggle error:", err);
    }
  };

  if (loading) return null;

  return (
      <button
          onClick={handleToggle}
          className={\`px-4 py-2 rounded text-white \${isFriend ? "bg-red-500" : "bg-green-600"}\`}
    >
      {isFriend ? "Unfriend" : "Add Friend"}
    </button>
  );
}

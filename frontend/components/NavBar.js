import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function NavBar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    const fetchUnread = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Notification fetch error", err);
      }
    };

    fetchUser();
    fetchUnread();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          DoGood
        </Link>

        <div className="space-x-4 flex items-center">
          {user && (
              <span className="text-gray-700">
            👤 {user.name}
          </span>
          )}

          <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-indigo-600"
          >
            Logout
          </button>

          <Link href="/profile#Notifications" className="relative">
            <span className="text-2xl">🔔</span>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
            )}
          </Link>
        </div>
      </nav>
  );
}

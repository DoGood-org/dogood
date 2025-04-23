import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

export default function NavBar({ unreadMessages = 0 }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then(setUser)
        .catch((err) => console.warn("User fetch error:", err.message));

    fetch(`${process.env.NEXT_PUBLIC_API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch notifications");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch((err) => console.warn("Notification error:", err.message));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <nav className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-md px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50">
        <div className="flex items-center flex-wrap gap-2 md:gap-4">
          <Link href="/" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow">DoGood</Link>
          <Link href="/dashboard" className="navlink">Dashboard</Link>
          <Link href="/map" className="navlink">Map</Link>
          <Link href="/donate" className="navlink">Donate</Link>
          <Link href="/goodbot" className="navlink">GoodBot</Link>
          <Link href="/settings" className="navlink">Settings</Link>
        </div>

        <div className="flex items-center space-x-4 relative">
          <ThemeToggle />

          {user && (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                      onClick={() => setShowDropdown((v) => !v)}
                      className="relative bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    🔔
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                    )}
                  </button>
                  {showDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow z-50 max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500">No notifications</div>
                        ) : (
                            notifications.map((n, i) => (
                                <div key={i} className="p-2 border-b text-sm hover:bg-gray-100">
                                  {n.message}
                                </div>
                            ))
                        )}
                      </div>
                  )}
                </div>

                <Link href="/messages" className="relative bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                  💬
                  {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
                  {unreadMessages}
                </span>
                  )}
                </Link>

                <Link href="/profile" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
                  {user?.name || "Profile"}
                </Link>

                <button
                    onClick={logout}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
                >
                  Logout
                </button>
              </>
          )}

          {!user && (
              <div className="flex items-center gap-2">
                <Link href="/login" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Login</Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">Register</Link>
              </div>
          )}
        </div>

        <style jsx>{`
        .navlink {
          background-color: #14b8a6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .navlink:hover {
          background-color: #0d9488;
        }
      `}</style>
      </nav>
  );
}

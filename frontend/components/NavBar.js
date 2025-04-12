// components/NavBar.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));

      fetch(`${process.env.NEXT_PUBLIC_API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setNotifications(data.filter((n) => !n.read).length));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50">
      <div className="flex items-center flex-wrap gap-2 md:gap-4">
        <Link href="/" className="text-xl font-bold text-teal-400">
          DoGood
        </Link>
        <Link href="/dashboard" className="hover:text-teal-300">
          Dashboard
        </Link>
        <Link href="/map" className="hover:text-teal-300">
          Map
        </Link>
        <Link href="/donate" className="hover:text-teal-300">
          Donate
        </Link>
        <Link href="/goodbot" className="hover:text-teal-300">
          GoodBot
        </Link>
        <Link href="/settings" className="hover:text-teal-300">
          Settings
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/notifications" className="relative hover:text-teal-300">
              🔔
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                  {notifications}
                </span>
              )}
            </Link>
            <Link href="/profile" className="hover:text-teal-300">
              {user.name || "Profile"}
            </Link>
            <button
              onClick={logout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-teal-300">
              Login
            </Link>
            <Link href="/register" className="hover:text-teal-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

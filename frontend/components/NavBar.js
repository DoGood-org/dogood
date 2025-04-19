// components/NavBar.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from './ThemeToggle';

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
          <Link
              href="/"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            DoGood
          </Link>
          <Link
              href="/dashboard"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Dashboard
          </Link>
          <Link
              href="/map"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Map
          </Link>
          <Link
              href="/donate"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Donate
          </Link>
          <Link
              href="/goodbot"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            GoodBot
          </Link>
          <Link
              href="/settings"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Settings
          </Link>
        </div>

        <div className="flex items-center space-x-4">

          <Link
              href={user ? "/profile" : "/login"}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            {user?.name || "Profile"}
          </Link>
          <button
              onClick={logout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
              style={{ display: user ? "inline-block" : "none" }}
          >
            Logout
          </button>

        </div>

        {!user && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Login</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">Register</Link>

            </div>
        )}
      </nav>
  );
}
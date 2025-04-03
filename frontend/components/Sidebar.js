import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    fetchUser();
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "My Profile" },
    { href: "/myposts", label: "My Posts" },
    { href: "/my-deeds", label: "My Good Deeds" },
    { href: "/my-hours", label: "My Help Hours" },
    { href: "/wallet", label: "Wallet" },
    { href: "/verification", label: "Verification" },
    { href: "/settings", label: "Settings" },
    { href: "/goodbot", label: "GoodBot 🤖" },
    { href: "/map", label: "GoodMap 🗺️" },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r shadow-sm hidden md:flex flex-col p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          👤
        </div>
        <div className="mt-2 text-center font-semibold text-gray-700">
          {user ? user.name : "Loading..."}
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div
              className={`block px-4 py-2 rounded cursor-pointer hover:bg-indigo-100 ${
                router.pathname === link.href
                  ? "bg-indigo-200 text-indigo-900 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {link.label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

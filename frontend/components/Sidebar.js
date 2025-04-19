// components/Sidebar.js
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

  const groupedLinks = [
    {
      title: "My Account",
      items: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "My Profile" },
        { href: "/myposts", label: "My Posts" },
        { href: "/my-deeds", label: "My Good Deeds" },
        { href: "/my-hours", label: "My Help Hours" },
        { href: "/wallet", label: "Wallet" },
        { href: "/badges", label: "Badges" },
        { href: "/grants", label: "Grants" },
      ],
    },
    {
      title: "Actions",
      items: [
        { href: "/map", label: "Map" },
        { href: "/posts", label: "Posts" },
        { href: "/volunteer", label: "Volunteer" },
        { href: "/donate", label: "Donate" },
        { href: "/goodbot", label: "GoodBot" },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/verification", label: "Verification" },
        { href: "/support", label: "Support" },
        { href: "/settings", label: "Settings" },
      ],
    },
  ];

  return (
      <aside className="w-60 min-h-screen bg-gray-900 text-white hidden md:flex flex-col p-4 border-r border-gray-800">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="mt-2 text-center font-semibold text-sm text-gray-200">
            {user?.name || "Loading..."}
          </div>
        </div>

        {groupedLinks.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                {section.title}
              </div>
              <nav className="space-y-1">
                {section.items.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div
                          className={`block px-4 py-2 rounded cursor-pointer hover:bg-teal-700 transition ${
                              router.pathname === link.href
                                  ? "bg-teal-500 text-black font-semibold"
                                  : "text-gray-300"
                          }`}
                      >
                        {link.label}
                      </div>
                    </Link>
                ))}
              </nav>
            </div>
        ))}
      </aside>
  );
};

export default Sidebar;

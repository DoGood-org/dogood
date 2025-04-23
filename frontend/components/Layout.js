import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }) {
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API;

        if (!token || !apiUrl) return;

        fetch(`${apiUrl}/messages/unreadCount`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unread fetch failed");
                return res.json();
            })
            .then((counts) => {
                const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
                setUnread(total);
            })
            .catch((err) => {
                console.warn("🔴 Failed to load unread messages:", err.message);
                setUnread(0); // fallback to 0
            });
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
                <NavBar unreadMessages={unread} />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

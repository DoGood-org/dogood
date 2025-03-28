import { useEffect, useState } from "react";
import Link from "next/link";
import DarkModeToggle from "../components/DarkModeToggle";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!token) {
            console.error("🔴 Нет токена, редирект на вход...");
            window.location.href = "/login";
            return;
        }

        fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            });
    }, [token]);

    if (!user) return <p className="text-center text-xl mt-10">Загрузка...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400 p-6">
            <h1 className="text-4xl font-bold text-white">Привет, {user.name}!</h1>
            <DarkModeToggle />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <DashboardCard title="Кошелек" link="/wallet" color="bg-green-500" />
                <DashboardCard title="Достижения" link="/achievements" color="bg-yellow-500" />
                <DashboardCard title="Карта" link="/map" color="bg-blue-500" />
                <DashboardCard title="CSR" link="/csr" color="bg-purple-500" />
                <DashboardCard title="GoodBot" link="/goodbot" color="bg-red-500" />
            </div>
        </div>
    );
}

function DashboardCard({ title, link, color }) {
    return (
        <motion.div className={`p-6 rounded-lg shadow-md text-white ${color} hover:scale-105 transition transform`}>
            <Link href={link} className="block text-center text-xl font-bold">{title}</Link>
        </motion.div>
    );
}

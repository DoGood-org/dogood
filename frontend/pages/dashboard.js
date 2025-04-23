import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.name) setUser(data);
                else router.push("/login");
            })
            .catch(() => router.push("/login"));
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <p className="text-gray-700 mb-4">Role: {user.role}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow hover:shadow-md">
                    <h2 className="font-bold mb-2">Your Posts</h2>
                    <p className="text-sm text-gray-500">View or create help requests</p>
                </div>
                <div className="bg-white p-4 rounded shadow hover:shadow-md">
                    <h2 className="font-bold mb-2">Messages</h2>
                    <p className="text-sm text-gray-500">Check your inbox</p>
                </div>
                <div className="bg-white p-4 rounded shadow hover:shadow-md">
                    <h2 className="font-bold mb-2">GoodBot</h2>
                    <p className="text-sm text-gray-500">Talk with our AI assistant</p>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PublicProfileCard({ user }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setCurrentUser)
            .catch(() => {});
    }, []);

    if (!user) return null;

    const showChat = currentUser && currentUser._id !== user._id;

    return (
        <div className="bg-white rounded shadow p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
                        {user.name?.[0] || "?"}
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">@{user.slug}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                    {user.bio && <p className="text-sm mt-1 text-gray-700">{user.bio.slice(0, 80)}...</p>}
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-3 sm:mt-0 sm:ml-auto text-sm">
                <Link
                    href={`/u/${user.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-center"
                >
                    View Profile
                </Link>

                {showChat && (
                    <Link
                        href={`/messages?to=${user._id}`}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-center"
                    >
                        Message
                    </Link>
                )}
            </div>
        </div>
    );
}

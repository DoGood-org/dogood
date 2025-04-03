import { useEffect, useState } from "react";

export default function FriendsPage() {
    const [friends, setFriends] = useState([
        { id: 1, name: "Alice Johnson", status: "Active" },
        { id: 2, name: "Bob Smith", status: "Offline" },
        { id: 3, name: "Carol Lee", status: "Active" },
    ]);

    useEffect(() => {
        document.title = "Friends";
        // Fetch real friends data here in future
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Friends</h1>

            <div className="space-y-4">
                {friends.map((friend) => (
                    <div
                        key={friend.id}
                        className="flex items-center justify-between p-4 bg-white rounded shadow-md hover:shadow-lg transition"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{friend.name}</h2>
                            <p className="text-sm text-gray-500">Status: {friend.status}</p>
                        </div>
                        <span
                            className={`h-3 w-3 rounded-full ${friend.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                        ></span>
                    </div>
                ))}
            </div>
        </div>
    );
}

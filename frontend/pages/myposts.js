import { useEffect, useState } from "react";

export default function MyPosts() {
    const [posts, setPosts] = useState([
        { id: 1, title: "Helped at the local shelter", date: "2024-11-10" },
        { id: 2, title: "Organized a food drive", date: "2024-12-05" },
    ]);

    useEffect(() => {
        document.title = "My Posts";
        // Replace with API call to fetch user posts
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">My Posts</h1>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="p-4 bg-white rounded shadow-md hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                        <p className="text-sm text-gray-500">Date: {post.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

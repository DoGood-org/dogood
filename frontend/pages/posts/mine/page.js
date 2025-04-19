
import { useEffect, useState } from "react";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "123"; // или заменить на реальный
    fetch(`/api/posts/mine?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then(setPosts)
      .catch((err) => {
        console.error("Error loading posts:", err);
        setError(err.message || "Failed to load posts");
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
              <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
              <p className="text-sm">{post.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

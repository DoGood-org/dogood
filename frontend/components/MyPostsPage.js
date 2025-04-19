
'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/posts/mine", {
          params: { userId: "6802795706d4042e7089949a" },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts");
      }
    };
    if (typeof window !== "undefined") {
      fetchPosts();
    }
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="max-w-2xl mx-auto p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full p-2 border rounded mb-4 text-black"
      />

      {error && <p className="text-red-500">{error}</p>}

      {paginatedPosts.map((post, index) => (
        <div key={index} className="p-3 mb-2 border rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}

      {filteredPosts.length === 0 && !error && (
        <p className="text-center text-gray-500">No posts found.</p>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

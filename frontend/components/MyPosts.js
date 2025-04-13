
import { useEffect, useState } from "react";
import Toast from "../components/Toast";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/mine`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setToast({ message: data.msg || "Failed to load posts", type: "error" });
        }
      } catch {
        setToast({ message: "Server error while fetching posts", type: "error" });
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full p-2 border rounded mb-4"
      />

      {paginatedPosts.map((post, index) => (
        <div key={index} className="p-3 mb-2 border rounded bg-white">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}

      {filteredPosts.length === 0 && (
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
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
    </div>
  );
}

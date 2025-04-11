// components/PostCard.js
export default function PostCard({ post }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-4">
      <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
      <p className="text-sm text-teal-300 mb-2">{post.category} | Urgency: {post.urgency}</p>
      <p className="mb-4">{post.content}</p>
      <div className="flex gap-4">
        <button className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600">Comment</button>
        <button className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600">Share</button>
        <button className="px-4 py-1 bg-teal-500 text-black rounded hover:bg-teal-400">Help</button>
      </div>
    </div>
  );
}
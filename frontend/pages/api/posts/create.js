// pages/posts/create.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreatePostPage() {
  const [form, setForm] = useState({ title: '', content: '', category: '', urgency: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send data to the backend
    console.log('Post created:', form);
    router.push('/posts');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="w-full p-3 text-black rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Describe your request or offer..."
          onChange={handleChange}
          className="w-full p-3 text-black rounded h-40"
          required
        />
        <select name="category" onChange={handleChange} required className="w-full p-3 text-black rounded">
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
          <option value="Elderly">Elderly</option>
          <option value="Accompany">Accompany</option>
        </select>
        <select name="urgency" onChange={handleChange} required className="w-full p-3 text-black rounded">
          <option value="">Urgency Level</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button type="submit" className="bg-teal-400 text-black px-6 py-2 rounded hover:bg-teal-300">
          Submit Post
        </button>
      </form>
    </div>
  );
}
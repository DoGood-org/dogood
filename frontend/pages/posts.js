// pages/posts.js
import { useState } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

const samplePosts = [
  {
    id: 1,
    title: 'Need warm clothes for kids',
    category: 'Clothes',
    urgency: 'High',
    content: 'Looking for jackets and boots for children aged 4-10.',
  },
  {
    id: 2,
    title: 'Elderly neighbor needs help shopping',
    category: 'Elderly',
    urgency: 'Medium',
    content: 'She cannot walk to the store and needs weekly support.',
  },
  {
    id: 3,
    title: 'Need food packages for refugees',
    category: 'Food',
    urgency: 'Urgent',
    content: 'We support 25 families from Ukraine every weekend.',
  },
];

export default function PostsPage() {
  const [filter, setFilter] = useState('');

  const filtered = samplePosts.filter((post) => {
    if (!filter) return true;
    return post.urgency.toLowerCase().includes(filter.toLowerCase());
  });

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        {/* Header with title and create post button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link href="/posts/create" className="bg-teal-400 text-black px-4 py-2 rounded hover:bg-teal-300">
            Create Post
          </Link>
        </div>

        {/* Urgency Filters */}
        <div className="flex gap-4 mb-6">
          {['', 'High', 'Medium', 'Low', 'Urgent'].map((label) => (
              <button
                  key={label}
                  onClick={() => setFilter(label)}
                  className={`px-3 py-1 rounded border ${filter === label ? 'bg-teal-400 text-black' : 'border-gray-600'}`}
              >
                {label || 'All'}
              </button>
          ))}
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
  );
}
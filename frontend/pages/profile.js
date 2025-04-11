// pages/profile.js
import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'My Posts' },
    { id: 'deeds', label: 'My Good Deeds' },
    { id: 'hours', label: 'My Help Hours' },
    { id: 'awards', label: 'My Awards' },
  ];

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>

        {/* Avatar and Personal Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <Image src="/avatar-placeholder.png" alt="Avatar" width={100} height={100} className="rounded-full" />
          <div>
            <p className="text-xl font-semibold">John Doe</p>
            <p>Email: john@example.com</p>
            <p>Location: Berlin, Germany</p>
            <p>Skills: Volunteering, First Aid, Mentoring</p>
            <button className="mt-2 px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-400">Edit Profile</button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-teal-700 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm">Posts</p>
          </div>
          <div className="bg-green-700 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">28</p>
            <p className="text-sm">Good Deeds</p>
          </div>
          <div className="bg-yellow-600 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">15h</p>
            <p className="text-sm">Help Hours</p>
          </div>
          <div className="bg-purple-700 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm">Awards</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-gray-700 mb-4">
          {tabs.map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 ${activeTab === tab.id ? 'border-b-2 border-teal-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 p-4 rounded-xl">
          {activeTab === 'posts' && <p>Here are your posts...</p>}
          {activeTab === 'deeds' && <p>Here are your good deeds...</p>}
          {activeTab === 'hours' && <p>You helped for 15 hours...</p>}
          {activeTab === 'awards' && <p>Your awards and badges...</p>}
        </div>
      </div>
  );
}

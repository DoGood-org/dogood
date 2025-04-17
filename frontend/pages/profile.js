import { useState } from 'react';
import { useEffect } from 'react';
import { getSocket } from "@/lib/socket";
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import MyPosts from '../components/MyPosts';
import UserChatList from '../components/UserChatList';
import MyGoodDeeds from '../components/MyGoodDeeds';
import MyHelpHours from '../components/MyHelpHours';
import StatisticsCard from '../components/StatisticsCard';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState({ name: '', location: '', avatar: '', _id: '123' });
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // Load user profile
        setUser({ name: 'John Doe', location: 'Berlin', avatar: '', _id: '123' });

        useEffect(() => {
            const socket = getSocket();
            socket.emit("online", user._id || "123");
            socket.on("onlineUsers", (list) => {
                console.log("🟢 Онлайн:", list);
            });
            return () => {
                socket.disconnect();
            };
        }, [user._id]);
    }, []);

    const handleSave = async () => {
        try {
            await axios.post('/api/user/update', user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const tabs = [
        { id: 'messages', label: `Messages ${unreadCount > 0 ? `(${unreadCount})` : ''}` },
        { id: 'posts', label: 'My Posts' },
        { id: 'deeds', label: 'My Good Deeds' },
        { id: 'hours', label: 'My Help Hours' },
        { id: 'awards', label: 'My Awards' },
    ];

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await axios.get('/api/messages/unreadCount?userId=123');
                setUnreadCount(res.data.count);
            } catch (err) {
                console.error('Failed to load unread count', err);
            }
        };
        fetchUnread();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-4">My Profile</h1>

            {/* Editable Profile */}
            <div className="bg-gray-800 p-4 rounded-xl mb-6">
                <div className="flex gap-4 items-center mb-4">
                    <Image src={user.avatar || "/avatar-placeholder.png"} alt="Avatar" width={100} height={100} className="rounded-full" />
                    {onlineUsers.includes(user._id) && <span className="text-green-400 ml-2">● Online</span>}
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="bg-white text-black p-2 rounded w-full"
                        placeholder="Your name"
                    />
                </div>
                <input
                    type="text"
                    value={user.location}
                    onChange={(e) => setUser({ ...user, location: e.target.value })}
                    className="bg-white text-black p-2 rounded w-full mb-2"
                    placeholder="Your location"
                />
                <input
                    type="text"
                    value={user.avatar}
                    onChange={(e) => setUser({ ...user, avatar: e.target.value })}
                    className="bg-white text-black p-2 rounded w-full mb-2"
                    placeholder="Avatar URL"
                />
                <button
                    onClick={handleSave}
                    className="bg-teal-500 px-4 py-2 rounded text-black hover:bg-teal-400"
                >
                    Save Changes
                </button>
                <StatisticsCard userId={user._id} />
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
                {activeTab === 'posts' && <MyPosts />}
                {activeTab === 'deeds' && <MyGoodDeeds />}
                {activeTab === 'hours' && <MyHelpHours />}
                {activeTab === 'messages' && <UserChatList userId="123" />}
                {activeTab === 'awards' && <p>Your awards and badges...</p>}
            </div>
        </div>
    );
}
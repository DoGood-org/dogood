// Enhanced version of MapPage.js with chat button added without cutting existing content
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import GoodBotChatModal from "../components/GoodBotChatModal";
import ChatBox from "../components/ChatBox";
import MapForm from "./MapForm";
import CategoryIcon from "../components/CategoryIcon";
import BottomFilterBar from "../components/BottomFilterBar";
import TopTabs from "../components/TopTabs";

const categories = [
    { key: "volunteer", label: "Volunteers" },
    { key: "animals", label: "Animals" },
    { key: "nature", label: "Nature" },
    { key: "education", label: "Education" },
    { key: "medical", label: "Medical" },
    { key: "community", label: "Community" },
];

const mockActivity = [
    { icon: "✅", label: "Helped clean park", date: "Apr 14, 2025", category: "Nature" },
    { icon: "🙌", label: "Joined donation drive", date: "Apr 12, 2025", category: "Community" },
    { icon: "🐶", label: "Cared for animals", date: "Apr 10, 2025", category: "Animals" },
];

const mockBadges = [
    { emoji: "🎖️", name: "Kind Helper", description: "Completed 5 good deeds" },
    { emoji: "🔥", name: "Active Week", description: "Participated every day this week" },
    { emoji: "💡", name: "Idea Giver", description: "Suggested improvements via feedback" },
];

const mockActivity = [
    { icon: "✅", label: "Helped clean park", date: "Apr 14, 2025", category: "Nature" },
    { icon: "🙌", label: "Joined donation drive", date: "Apr 12, 2025", category: "Community" },
    { icon: "🐶", label: "Cared for animals", date: "Apr 10, 2025", category: "Animals" },
];

const mockBadges = [
    { emoji: "🎖️", name: "Kind Helper", description: "Completed 5 good deeds" },
    { emoji: "🔥", name: "Active Week", description: "Participated every day this week" },
    { emoji: "💡", name: "Idea Giver", description: "Suggested improvements via feedback" },
];

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPageEnhanced() {
    const [deeds, setDeeds] = useState([]);
    const [coords, setCoords] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [botOpen, setBotOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Tasks");
    const [distance, setDistance] = useState(0);
    const [dateRange, setDateRange] = useState("all");
    const [joinedIds, setJoinedIds] = useState([]);
    const [profile, setProfile] = useState({
        name: "Alexander",
        bio: "Enthusiast, volunteer and founder of DoGood."
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => console.warn("Geolocation failed")
        );
    }, []);

    useEffect(() => {
        fetchDeeds();
    }, [activeCategory, coords, distance, dateRange]);

    const fetchDeeds = async () => {
        let url = `${process.env.NEXT_PUBLIC_API}/api/deeds`;
        const params = new URLSearchParams();

        if (activeCategory) params.append("category", activeCategory);
        if (distance > 0 && coords) {
            params.append("distance", distance);
            params.append("lat", coords.lat);
            params.append("lng", coords.lng);
        }
        if (dateRange !== "all") {
            const days = parseInt(dateRange);
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);
            params.append("fromDate", fromDate.toISOString());
        }

        if (params.toString()) url += `?${params.toString()}`;

        const handleJoin = async (id) => {
            if (joinedIds.includes(id)) return;
            setJoinedIds((prev) => [...prev, id]);
        };

        return (
            <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0e1f1f] to-[#1e3a3a] text-white pb-28">
                <TopTabs active={activeTab} setActive={setActiveTab} />

                <div className="text-center py-4 text-3xl font-bold">GoodMap</div>

                {/* Distance and Date filters */}
                <div className="max-w-4xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm block mb-1">Distance filter:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="w-full p-2 rounded bg-white text-black shadow"
                        >
                            <option value={0}>All distances</option>
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={25}>25 km</option>
                            <option value={50}>50 km</option>
                            <option value={100}>100 km</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm block mb-1">Show deeds from:</label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full p-2 rounded bg-white text-black shadow"
                        >
                            <option value="all">All time</option>
                            <option value="1">Last 24 hours</option>
                            <option value="3">Last 3 days</option>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                        </select>
                    </div>
                </div>

                {/* GoodBot animated */}
                <motion.div
                    className="absolute z-[1000] left-1/2 top-[calc(50%-40px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setBotOpen(true)}
                    animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px teal", "0 0 20px cyan", "0 0 0px teal"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <img src="/goodbot.png" alt="GoodBot" className="w-20 h-20 rounded-full" />
                </motion.div>

                {/* Chat button */}
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="fixed bottom-6 right-6 z-[1500] bg-teal-500 hover:bg-teal-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
                    title="Open chat"
                >
                    💬
                </button>

                {chatOpen && <ChatBox onClose={() => setChatOpen(false)} partner="Julia" />}

                {/* Category icons radial */}
                <div className="absolute inset-0 pointer-events-none">
                    {categories.map((cat, i) => {
                        const angle = (360 / categories.length) * i;
                        const rad = (angle * Math.PI) / 180;
                        const r = 120;
                        const x = r * Math.cos(rad);
                        const y = r * Math.sin(rad);
                        return (
                            <div
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className="absolute pointer-events-auto transform hover:scale-110 transition"
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <CategoryIcon active={activeCategory === cat.key} label={cat.label} />
                            </div>
                        );
                    })}
                </div>

                {/* Map */}
                <div className="w-full h-[600px] z-10 relative">
                    <MapContainer center={coords || [48.85, 2.35]} zoom={5} className="h-full w-full">
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {deeds.map((deed) => (
                            <Marker key={deed._id} position={[deed.location.lat, deed.location.lng]}>
                                <Popup>
                                    <strong>{deed.title}</strong>
                                    <br />
                                    {deed.description}
                                    <br />
                                    <button
                                        onClick={() => handleJoin(deed._id)}
                                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        {joinedIds.includes(deed._id) ? "✅ You’ve joined!" : "Join"}
                                    </button>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Tab Content */}
                <div className="mt-6 max-w-5xl mx-auto px-4">
                    {activeTab === "Tasks" && <p>🔧 Tasks content coming soon...</p>}
                    {activeTab === "Requests" && <p>📥 Active help requests will be shown here.</p>}
                    {activeTab === "Profile" && (
                        <div className="space-y-6">
                            <div className="space-y-4 mb-6">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="Your name"
                                    className="w-full p-2 rounded border text-black"
                                />
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Short bio"
                                    className="w-full p-2 rounded border text-black"
                                />
                                <button
                                    onClick={() => alert('✅ Profile saved')}
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                                >
                                    Save changes
                                </button>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Your Activity</h2>
                                <ul className="space-y-2">
                                    {mockActivity.map((item, i) => (
                                        <li key={i} className="bg-white text-black rounded p-4 shadow">
                                            {item.icon} {item.label} — <span className="italic">{item.date}</span> ({item.category})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Your Badges</h2>
                                <ul className="flex flex-wrap gap-4">
                                    {mockBadges.map((badge, i) => (
                                        <li key={i} className="bg-yellow-100 text-black rounded-xl px-4 py-2 shadow text-sm">
                                            <span className="text-lg mr-2">{badge.emoji}</span>
                                            <span className="font-semibold">{badge.name}</span>
                                            <br />
                                            <span className="text-xs italic">{badge.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* GoodBot Chat Modal */}
                {botOpen && <GoodBotChatModal onClose={() => setBotOpen(false)} />}

                {/* Bottom Filter Bar */}
                <BottomFilterBar active={activeCategory} setActive={setActiveCategory} />
            </div>
        );
        if (params.toString()) url += `?${params.toString()}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setDeeds(data);
        } catch (err) {
            console.error("Failed to load deeds:", err);
        }
    };

    const handleJoin = async (id) => {
        if (joinedIds.includes(id)) return;
        setJoinedIds((prev) => [...prev, id]);
    };

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0e1f1f] to-[#1e3a3a] text-white pb-28">
            <TopTabs active={activeTab} setActive={setActiveTab} />

            <div className="text-center py-4 text-3xl font-bold">GoodMap</div>

            {/* Distance and Date filters */}
            <div className="max-w-4xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm block mb-1">Distance filter:</label>
                    <select
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full p-2 rounded bg-white text-black shadow"
                    >
                        <option value={0}>All distances</option>
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={25}>25 km</option>
                        <option value={50}>50 km</option>
                        <option value={100}>100 km</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm block mb-1">Show deeds from:</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full p-2 rounded bg-white text-black shadow"
                    >
                        <option value="all">All time</option>
                        <option value="1">Last 24 hours</option>
                        <option value="3">Last 3 days</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                    </select>
                </div>
            </div>

            {/* GoodBot animated */}
            <motion.div
                className="absolute z-[1000] left-1/2 top-[calc(50%-40px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setBotOpen(true)}
                animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px teal", "0 0 20px cyan", "0 0 0px teal"] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <img src="/goodbot.png" alt="GoodBot" className="w-20 h-20 rounded-full" />
            </motion.div>

            {/* Chat button */}
            <button
                onClick={() => setChatOpen(!chatOpen)}
                className="fixed bottom-6 right-6 z-[1500] bg-teal-500 hover:bg-teal-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
                title="Open chat"
            >
                💬
            </button>

            {chatOpen && <ChatBox onClose={() => setChatOpen(false)} partner="Julia" />}

            {/* Category icons radial */}
            <div className="absolute inset-0 pointer-events-none">
                {categories.map((cat, i) => {
                    const angle = (360 / categories.length) * i;
                    const rad = (angle * Math.PI) / 180;
                    const r = 120;
                    const x = r * Math.cos(rad);
                    const y = r * Math.sin(rad);
                    return (
                        <div
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className="absolute pointer-events-auto transform hover:scale-110 transition"
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <CategoryIcon active={activeCategory === cat.key} label={cat.label} />
                        </div>
                    );
                })}
            </div>

            {/* Map */}
            <div className="w-full h-[600px] z-10 relative">
                <MapContainer center={coords || [48.85, 2.35]} zoom={5} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {deeds.map((deed) => (
                        <Marker key={deed._id} position={[deed.location.lat, deed.location.lng]}>
                            <Popup>
                                <strong>{deed.title}</strong>
                                <br />
                                {deed.description}
                                <br />
                                <button
                                    onClick={() => handleJoin(deed._id)}
                                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                    {joinedIds.includes(deed._id) ? "✅ You’ve joined!" : "Join"}
                                </button>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Tab Content */}
            <div className="mt-6 max-w-5xl mx-auto px-4">
                {activeTab === "Tasks" && <p>🔧 Tasks content coming soon...</p>}
                {activeTab === "Requests" && <p>📥 Active help requests will be shown here.</p>}
                {activeTab === "Profile" && (
                    <div className="space-y-6">
                        <div className="space-y-4 mb-6">
                            <h2 className="text-xl font-bold">Edit Profile</h2>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your name"
                                className="w-full p-2 rounded border text-black"
                            />
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Short bio"
                                className="w-full p-2 rounded border text-black"
                            />
                            <button
                                onClick={() => alert('✅ Profile saved')}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                            >
                                Save changes
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Your Activity</h2>
                            <ul className="space-y-2">
                                {mockActivity.map((item, i) => (
                                    <li key={i} className="bg-white text-black rounded p-4 shadow">
                                        {item.icon} {item.label} — <span className="italic">{item.date}</span> ({item.category})
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Your Badges</h2>
                            <ul className="flex flex-wrap gap-4">
                                {mockBadges.map((badge, i) => (
                                    <li key={i} className="bg-yellow-100 text-black rounded-xl px-4 py-2 shadow text-sm">
                                        <span className="text-lg mr-2">{badge.emoji}</span>
                                        <span className="font-semibold">{badge.name}</span>
                                        <br />
                                        <span className="text-xs italic">{badge.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* GoodBot Chat Modal */}
            {botOpen && <GoodBotChatModal onClose={() => setBotOpen(false)} />}

            {/* Bottom Filter Bar */}
            <BottomFilterBar active={activeCategory} setActive={setActiveCategory} />
        </div>
    );
}

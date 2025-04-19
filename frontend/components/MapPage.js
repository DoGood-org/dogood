import React, { useState, useEffect } from "react";
import TopTabs from "@/components/TopTabs";
import { motion } from "framer-motion";
import CategoryIcon from "@/components/CategoryIcon";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BottomFilterBar from "@/components/BottomFilterBar";
import ChatBox from "@/components/ChatBox";
import GoodBotChatModal from "./GoodBotChatModal";
export default function MapPageEnhanced() {
    const [deeds, setDeeds] = useState([]);
    const [coords, setCoords] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [botOpen, setBotOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("Tasks");
    const [distance, setDistance] = useState(0);
    const [dateRange, setDateRange] = useState("all");
    const [typeFilters, setTypeFilters] = useState(["sos", "help", "donation", "volunteer"]);
    const [joinedIds, setJoinedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = [
        { key: "sos", label: "SOS" },
        { key: "help", label: "Help" },
        { key: "donation", label: "Donation" },
        { key: "volunteer", label: "Volunteer" },
    ];


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
        if (typeFilters.length > 0) typeFilters.forEach((t) => params.append("type", t));
        if (dateRange !== "all") {
            const days = parseInt(dateRange);
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);
            params.append("fromDate", fromDate.toISOString());
        }

        if (params.toString()) url += `?${params.toString()}`;

        const sendThankYou = async (id) => {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API}/api/thanks/${id}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                alert("Thank You sent!");
            } catch (err) {
                console.error("Failed to send Thank You", err);
            }
        };

        const handleJoin = async (id) => {
            if (joinedIds.includes(id)) return;
            setJoinedIds((prev) => [...prev, id]);
        };

        return (
            <div className="relative w-full min-h-screen bg-white text-black pb-28">

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#0e1f1f] to-[#1e3a3a] text-white px-6 py-3 shadow-md">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">GoodMap</span>
                        <motion.div className="cursor-pointer" onClick={() => setBotOpen(true)} animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}><img src="/goodbot.png" alt="GoodBot" className="w-10 h-10 rounded-full" /></motion.div>

                    </div>
                    <TopTabs active={activeTab} setActive={setActiveTab} />
                </div>












                {/* GoodBot animated */}


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
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-[2000] bg-black bg-opacity-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
                        </div>
                    )}




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
                                    <button
                                        onClick={() => sendThankYou(deed._id)}
                                        className="mt-2 ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Thank You
                                    </button>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Tab Content */}
                <div className="mt-6 max-w-5xl mx-auto px-4">
                    {filtersOpen && <div className="mt-2 text-sm text-gray-700 bg-white bg-opacity-80 p-2 rounded shadow max-w-xs">🔧 Tasks content coming soon...</div>}
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


                {/* Filters Button */}
                <div className="flex justify-end px-4 mt-6">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200"
                    >
                        Filters ⚙️
                    </button>
                </div>

                {filtersOpen && (
                    <div className="mt-4 mx-4 mb-6 max-w-3xl bg-white bg-opacity-95 backdrop-blur-md text-black p-4 z-[999] shadow-lg rounded-xl">
                        <div className="text-lg font-bold mb-2">Map Filters</div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Distance:</label>
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

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Show deeds from:</label>
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

                        <div className="grid grid-cols-2 gap-2">
                            {["sos", "help", "donation", "volunteer"].map((type) => (
                                <label key={type} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={typeFilters.includes(type)}
                                        onChange={() =>
                                            setTypeFilters((prev) =>
                                                prev.includes(type)
                                                    ? prev.filter((t) => t !== type)
                                                    : [...prev, type]
                                            )
                                        }
                                    />
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                )}


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

    const sendThankYou = async (id) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API}/api/thanks/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Thank You sent!");
        } catch (err) {
            console.error("Failed to send Thank You", err);
        }
    };

    const handleJoin = async (id) => {
        if (joinedIds.includes(id)) return;
        setJoinedIds((prev) => [...prev, id]);
    };

    return (
        <div className="relative w-full min-h-screen bg-white text-black pb-28">

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#0e1f1f] to-[#1e3a3a] text-white px-6 py-3 shadow-md">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">GoodMap</span>
                    <motion.div className="cursor-pointer" onClick={() => setBotOpen(true)} animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}><img src="/goodbot.png" alt="GoodBot" className="w-10 h-10 rounded-full" /></motion.div>

                </div>
                <TopTabs active={activeTab} setActive={setActiveTab} />
            </div>












            {/* GoodBot animated */}


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
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-[2000] bg-black bg-opacity-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
                    </div>
                )}




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
                {filtersOpen && <div className="mt-2 text-sm text-gray-700 bg-white bg-opacity-80 p-2 rounded shadow max-w-xs">🔧 Tasks content coming soon...</div>}
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
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-2">Your Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm text-gray-600">Good Deeds</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">8</div>
                                    <div className="text-sm text-gray-600">Thank You</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">21</div>
                                    <div className="text-sm text-gray-600">Help Hours</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">137</div>
                                    <div className="text-sm text-gray-600">Karma Points</div>
                                </div>
                            </div>
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
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-2">Your Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm text-gray-600">Good Deeds</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">8</div>
                                    <div className="text-sm text-gray-600">Thank You</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">21</div>
                                    <div className="text-sm text-gray-600">Help Hours</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow text-center">
                                    <div className="text-2xl font-bold">137</div>
                                    <div className="text-sm text-gray-600">Karma Points</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* GoodBot Chat Modal */}
            {botOpen && <GoodBotChatModal onClose={() => setBotOpen(false)} />}


            {/* Filters Button */}
            <div className="flex justify-end px-4 mt-6">
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200"
                >
                    Filters ⚙️
                </button>
            </div>

            {filtersOpen && (
                <div className="mt-4 mx-4 mb-6 max-w-3xl bg-white bg-opacity-95 backdrop-blur-md text-black p-4 z-[999] shadow-lg rounded-xl">
                    <div className="text-lg font-bold mb-2">Map Filters</div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Distance:</label>
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

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Show deeds from:</label>
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

                    <div className="grid grid-cols-2 gap-2">
                        {["sos", "help", "donation", "volunteer"].map((type) => (
                            <label key={type} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={typeFilters.includes(type)}
                                    onChange={() =>
                                        setTypeFilters((prev) =>
                                            prev.includes(type)
                                                ? prev.filter((t) => t !== type)
                                                : [...prev, type]
                                        )
                                    }
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
            )}


            {/* Bottom Filter Bar */}
            <BottomFilterBar active={activeCategory} setActive={setActiveCategory} />



        </div>
    );
}





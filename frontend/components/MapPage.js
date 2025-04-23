import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import BottomFilterBar from "@/components/BottomFilterBar";
import GoodBotChatModal from "@/components/GoodBotChatModal";
import ChatBox from "@/components/ChatBox";
import MapForm from "@/components/MapForm";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapPage() {
    const [filters, setFilters] = useState({
        type: "",
        lat: null,
        lng: null,
        distance: 0,
        search: "",
    });

    const [botOpen, setBotOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // 👈 добавлено

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFilters((prev) => ({
                    ...prev,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }));
            },
            () => console.warn("Geolocation failed")
        );
    }, []);

    const handleTypeChange = (type) => setFilters((prev) => ({ ...prev, type }));
    const handleDistanceChange = (distance) => setFilters((prev) => ({ ...prev, distance }));
    const handleSearch = (value) => setFilters((prev) => ({ ...prev, search: value }));

    return (
        <div className="relative w-full h-screen bg-white text-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Map filters={filters} refreshKey={refreshKey} /> {/* 👈 добавлено */}
            </div>

            <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-4 py-2 bg-black bg-opacity-70 text-white shadow">
                <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">GoodMap</span>
                    <motion.div
                        onClick={() => setBotOpen(true)}
                        className="cursor-pointer"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <img src="/goodbot.png" alt="Bot" className="w-8 h-8 rounded-full" />
                    </motion.div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowForm(!showForm)} className="bg-white text-black px-3 py-1 rounded text-sm shadow">
                        {showForm ? "Close Form" : "➕ Add"}
                    </button>
                    <button onClick={() => setShowFilters(!showFilters)} className="bg-white text-black px-3 py-1 rounded text-sm shadow">
                        Filters
                    </button>
                    <button onClick={() => setChatOpen(true)} className="bg-teal-600 px-3 py-1 rounded text-sm text-white shadow">
                        💬 Chat
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="absolute top-[60px] left-4 z-30 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded shadow max-w-xs w-[260px]">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1">Search</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded border"
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Distance</label>
                            <select
                                value={filters.distance}
                                onChange={(e) => handleDistanceChange(Number(e.target.value))}
                                className="w-full p-2 rounded border"
                            >
                                <option value={0}>All</option>
                                <option value={5}>5 km</option>
                                <option value={10}>10 km</option>
                                <option value={25}>25 km</option>
                                <option value={50}>50 km</option>
                                <option value={100}>100 km</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white p-4 z-40 shadow-lg overflow-y-auto transition duration-300 ease-in-out">
                    <MapForm onNewPoint={() => setRefreshKey(Date.now())} /> {/* 👈 добавлено */}
                </div>
            )}

            {botOpen && <GoodBotChatModal onClose={() => setBotOpen(false)} />}
            {chatOpen && <ChatBox onClose={() => setChatOpen(false)} />}

            <div className="absolute bottom-0 left-0 w-full z-20">
                <BottomFilterBar active={filters.type} setActive={handleTypeChange} />
            </div>
        </div>
    );
}

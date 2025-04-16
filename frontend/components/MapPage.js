// Enhanced version of MapPage.js with GoodBot and radial filters
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import GoodBotChatModal from "../components/GoodBotChatModal";
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
  const [activeTab, setActiveTab] = useState("Tasks");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Geolocation failed")
    );

    fetchDeeds();
  }, [activeCategory]);

  const fetchDeeds = async () => {
    let url = `${process.env.NEXT_PUBLIC_API}/api/deeds`;
    if (activeCategory) url += `?category=${activeCategory}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setDeeds(data);
    } catch (err) {
      console.error("Failed to load deeds:", err);
    }
  };

  return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0e1f1f] to-[#1e3a3a] text-white pb-28">
        <TopTabs active={activeTab} setActive={setActiveTab} />

        <div className="text-center py-4 text-3xl font-bold">GoodMap</div>

        {/* GoodBot animated */}
        <motion.div
            className="absolute z-[1000] left-1/2 top-[calc(50%-40px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setBotOpen(true)}
            animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px teal", "0 0 20px cyan", "0 0 0px teal"] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
          <img src="/goodbot.png" alt="GoodBot" className="w-20 h-20 rounded-full" />
        </motion.div>

        {/* Category icons radial */}
        <div className="absolute inset-0 pointer-events-none">
          {categories.map((cat, i) => {
            const angle = (360 / categories.length) * i;
            const rad = (angle * Math.PI) / 180;
            const r = 120; // radius from center
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
                  </Popup>
                </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Tab Content */}
        <div className="mt-6 max-w-5xl mx-auto px-4">
          {activeTab === "Tasks" && <p>🔧 Tasks content coming soon...</p>}
          {activeTab === "Requests" && <p>📥 Active help requests will be shown here.</p>}
          {activeTab === "Profile" && <p>👤 User profile with stats and achievements.</p>}
        </div>

        {/* GoodBot Chat Modal */}
        {botOpen && <GoodBotChatModal onClose={() => setBotOpen(false)} />}

        {/* Bottom Filter Bar */}
        <BottomFilterBar active={activeCategory} setActive={setActiveCategory} />
      </div>
  );
}

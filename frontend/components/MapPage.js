import { useEffect, useState } from "react";
import axios from "axios";
import MapForm from "./MapForm";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPageContent() {
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState(0);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    document.title = "DoGood Map";

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Geolocation failed")
      );
    }

    const fetchDeeds = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/deeds`);
        setDeeds(res.data);
      } catch (err) {
        console.error("Failed to load deeds:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeeds();
  }, []);

  const handleAdded = () => {
    setReload((prev) => prev + 1);
  };

  const filters = {
    ...filter,
    search,
    ...(distance > 0 && coords ? { distance, lat: coords.lat, lng: coords.lng } : {}),
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">GoodMap</h1>

      <MapForm onAdded={handleAdded} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            All
          </button>
          <button onClick={() => setFilter({ type: "help" })} className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
            Helpers
          </button>
          <button onClick={() => setFilter({ type: "need" })} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
            Need Help
          </button>

          <select
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="px-3 py-2 rounded border"
          >
            <option value={0}>All distances</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 p-2 border rounded"
        />
      </div>

      <div style={{ height: "600px", width: "100%" }} className="rounded overflow-hidden shadow">
        <MapContainer
          center={coords || [48.8566, 2.3522]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!loading &&
            deeds.map((deed) => (
              <Marker key={deed._id} position={[deed.location.lat, deed.location.lng]}>
                <Popup>
                  <strong>{deed.title}</strong>
                  <br />
                  {deed.description}
                  <br />
                  <em>{new Date(deed.date).toLocaleDateString()}</em>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}

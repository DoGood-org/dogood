import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Custom marker icon (to fix default icon bug in Leaflet + Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "DoGood Map";

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

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <MapContainer
        center={[48.8566, 2.3522]} // default: Paris
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
  );
}

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const helpIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const needHelpIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/929/929426.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function Map({ locations = [] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <p>Loading map...</p>;

    return (
        <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: "70vh", width: "100%" }} scrollWheelZoom>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {locations.map((loc, idx) => (
                <Marker
                    key={idx}
                    position={[loc.lat, loc.lng]}
                    icon={loc.type === "help" ? helpIcon : needHelpIcon}
                >
                    <Popup>
                        <strong>{loc.name}</strong>
                        <br />
                        Type: {loc.type === "help" ? "Can Help" : "Needs Help"}
                        <br />
                        {loc.description && <span>{loc.description}</span>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
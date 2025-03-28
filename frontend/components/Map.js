import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 📌 Отключаем SSR для Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function Map({ locations }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <p>Загрузка карты...</p>;

    return (
        <MapContainer center={[48.8566, 2.3522]} zoom={10} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, idx) => (
                <Marker key={idx} position={[loc.lat, loc.lng]}>
                    <Popup>{loc.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

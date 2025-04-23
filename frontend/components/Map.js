import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import L from "leaflet";

function UserLocation({ setCenter }) {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      map.setView(coords, 13);
      setCenter(coords);
    });
  }, [map, setCenter]);

  return null;
}

export default function Map({ filters, refreshKey }) {
  const [center, setCenter] = useState([48.85, 2.35]); // Default: Paris
  const [pins, setPins] = useState([]);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API}/map`;
        const params = new URLSearchParams();

        if (filters?.type) params.append("type", filters.type);
        if (filters?.search) params.append("search", filters.search);
        if (filters?.lat && filters?.lng && filters?.distance) {
          params.append("lat", filters.lat);
          params.append("lng", filters.lng);
          params.append("distance", filters.distance);
        }

        if ([...params].length > 0) url += `?${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setPins(data);
        } else {
          console.error("API response is not an array:", data);
          setPins([]);
        }
      } catch (err) {
        console.error("Failed to load map data", err);
        setPins([]);
      }
    };

    const getUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && data._id) setUserId(data._id);
      } catch (e) {
        console.error("Failed to fetch user ID", e);
      }
    };

    fetchPins();
    getUserId();
  }, [filters, refreshKey]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000");

    socket.on("newPoint", (point) => {
      setPins((prev) => [...prev, point]);
      setNotification({
        name: point.name,
        type: point.type,
      });
      setTimeout(() => setNotification(null), 4000);
    });

    return () => socket.disconnect();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/map/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) setPins((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete point");
    }
  };

  return (
      <div className="relative w-full h-full">
        {notification && (
            <div className="absolute top-4 right-4 z-[9999] bg-white border border-teal-500 text-black px-4 py-2 rounded shadow animate-bounce">
              <p className="text-sm">
                <strong>{notification.name}</strong> added a <em>{notification.type}</em> point
              </p>
            </div>
        )}

        <MapContainer center={center} zoom={13} scrollWheelZoom className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <UserLocation setCenter={setCenter} />

          {pins.map((pin) => (
              <Marker key={pin._id} position={[pin.lat, pin.lng]}>
                <Popup>
                  <strong>{pin.name}</strong>
                  <br />
                  {pin.description}
                  {pin.images && Array.isArray(pin.images) && pin.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {pin.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`img-${i}`}
                                className="rounded shadow max-w-[120px]"
                            />
                        ))}
                      </div>
                  )}
                  {userId === pin.user && (
                      <button
                          onClick={() => handleDelete(pin._id)}
                          className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                  )}
                </Popup>
              </Marker>
          ))}
        </MapContainer>
      </div>
  );
}

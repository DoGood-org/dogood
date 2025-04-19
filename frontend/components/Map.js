// components/Map.js
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

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

export default function Map({ filters }) {
  const [center, setCenter] = useState([51.505, -0.09]);
  const [pins, setPins] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        let url = "http://localhost:5000/api/map";
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
          console.error('API response is not an array:', data);
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
        const res = await fetch("http://localhost:5000/api/auth/me", {
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
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this location? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/map/${id}`, {
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
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-[500px] w-full rounded shadow">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UserLocation setCenter={setCenter} />

        {pins.length > 0 && pins.map((pin) => (
            <Marker key={pin._id} position={[pin.lat, pin.lng]} className='animated-marker'>
              <Popup>
                <strong>{pin.name}</strong>
                <br />
                {pin.description}
                {pin.images && Array.isArray(pin.images) && pin.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {pin.images.map((img, i) => (
                          <img key={i} src={img} alt={"img " + i} className="rounded shadow max-w-[120px]" />
                      ))}
                    </div>
                )}
                {pin.image && (
                    <img src={pin.image} alt="pin" className="mt-2 max-w-[200px] rounded shadow" />
                )}
                {userId === pin.user && (
                    <button
                        onClick={() => handleDelete(pin._id)}
                        className="block mt-2 px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                )}
              </Popup>
            </Marker>
        ))}
      </MapContainer>
  );
}


<style jsx global>{`
  .animated-marker {
    animation: bounce-in 0.6s ease;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0.5) translateY(-30px);
      opacity: 0;
    }
    60% {
      transform: scale(1.05) translateY(10px);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }
`}</style>

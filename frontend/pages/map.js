import { useEffect, useState } from "react";
import Map from "../components/Map";

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [useGoogle, setUseGoogle] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Карта волонтёрских инициатив</h1>
      <button onClick={() => setUseGoogle(!useGoogle)}>
        Переключить на {useGoogle ? "OpenStreetMap" : "Google Maps"}
      </button>
      <Map locations={locations} useGoogle={useGoogle} />
    </div>
  );
}

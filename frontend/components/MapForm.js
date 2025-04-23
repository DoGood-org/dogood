import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function MapForm({ onNewPoint }) {
  const [coords, setCoords] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("help");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setMessage({ type: "error", text: "Geolocation failed" })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords || !name || !description) {
      return setMessage({ type: "error", text: "Please fill all required fields." });
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/map/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...coords, name, description, type, images }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Location added!" });
        setName("");
        setDescription("");
        setImages([]);

        if (onNewPoint) onNewPoint(data); 

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000");
        socket.emit("broadcastPoint", data);
        socket.disconnect();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to submit." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Submission error." });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.toString());
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64s) => setImages(base64s));
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow"
      >
        <h2 className="text-xl font-semibold">Add yourself to the map</h2>

        {message && (
            <div
                className={`text-sm rounded px-3 py-2 ${
                    message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                }`}
            >
              {message.text}
            </div>
        )}

        <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
        />

        <textarea
            placeholder="How can you help? Or what do you need?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded"
            required
        ></textarea>

        <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
        >
          <option value="help">I can help</option>
          <option value="need">I need help</option>
          <option value="donation">Donation</option>
          <option value="sos">Emergency</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full"
        />

        {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                  <img key={i} src={img} alt={"preview " + i} className="rounded h-24 object-cover shadow" />
              ))}
            </div>
        )}

        <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
  );
}

import { useState, useEffect } from "react";
import Toast from "./Toast";

export default function MapForm() {
  const [coords, setCoords] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("help");
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setToast({ message: "Geolocation failed", type: "error" })
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords || !name || !description) {
      setToast({ message: "All fields are required", type: "error" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/map/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...coords, name, description, type }),
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ message: "Location added successfully", type: "success" });
        setName("");
        setDescription("");
      } else {
        setToast({ message: data.error || "Submission failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Error submitting data", type: "error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow max-w-md mx-auto space-y-4 mb-6"
    >
      <h2 className="text-xl font-semibold">Add Yourself to GoodMap</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description of your help or need"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      ></textarea>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="help">I can help</option>
        <option value="need">I need help</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </form>
  );
}

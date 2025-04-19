import { API_URL } from "@/config";
import { useState, useEffect } from "react";
import Toast from "./Toast";

export default function MapForm() {
  const [coords, setCoords] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("help");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [images, setImages] = useState([]);

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
      const res = await fetch(API_URL/api/map/add, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...coords, name, description, type, images }),
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


        <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
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
            }}
            className="w-full p-2 border rounded"
        />
        {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                  <img key={i} src={img} alt={"Preview " + i} className="w-full h-32 object-cover rounded shadow" />
              ))}
            </div>
        )}


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

import { useState } from "react";

export default function CreateRequestForm({ onSuccess }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    date: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
        setForm({ category: "", description: "", location: "", date: "" });
      } else {
        setError(data.message || "Failed to create request");
      }
    } catch {
      setError("Request error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Create a new help request</h3>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-2"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-2"
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-2"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-2"
      />
      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}

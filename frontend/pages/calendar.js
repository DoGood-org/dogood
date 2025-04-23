import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    organizer: "",
    type: "",
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/calendar`)
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => [...prev, data]);
        setToast("Event created!");
        setForm({ title: "", description: "", location: "", date: "", organizer: "", type: "" });
      } else {
        setToast(data.message || "Failed to create event");
      }
    } catch {
      setToast("Submission error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 Calendar Events</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mb-10 space-y-4">
        <h2 className="text-xl font-semibold">Add Event</h2>

        {toast && <p className="text-sm text-green-600">{toast}</p>}

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="organizer"
          value={form.organizer}
          onChange={handleChange}
          placeholder="Organizer"
          className="w-full p-2 border rounded"
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Event type (e.g. Workshop, Cleanup)"
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
          Submit
        </button>
      </form>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {events.map((event, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-sm mt-1">
              📍 {event.location} | 🕒 {new Date(event.date).toLocaleDateString()} | 🎓 {event.organizer}
            </p>
            <p className="text-sm italic mt-1">Type: {event.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

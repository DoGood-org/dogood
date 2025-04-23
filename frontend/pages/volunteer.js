import { useEffect, useState } from "react";
import PublicProfileCard from "@/components/PublicProfileCard";

const sampleEvents = [
  {
    id: 1,
    title: "Park Cleanup",
    location: "Berlin",
    category: "Environment",
    format: "On-site",
    time: "2h",
  },
  {
    id: 2,
    title: "Remote Tutoring",
    location: "Online",
    category: "Education",
    format: "Remote",
    time: "1.5h",
  },
  {
    id: 3,
    title: "Food Distribution",
    location: "Hamburg",
    category: "Social",
    format: "On-site",
    time: "3h",
  },
];

export default function VolunteerPage() {
  const [filters, setFilters] = useState({ location: "", category: "", format: "" });
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/users/all`)
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((u) => u.role === "volunteer");
          setVolunteers(filtered);
        });
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleJoin = (id) => {
    setJoinedEvents((prev) =>
        prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const filtered = sampleEvents.filter((e) => {
    if (filters.location && !e.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (filters.category && e.category !== filters.category) return false;
    if (filters.format && e.format !== filters.format) return false;
    return true;
  });

  return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Volunteer Zone</h1>

        <h2 className="text-xl font-semibold mb-4">People willing to help</h2>
        <div className="grid gap-4 mb-10">
          {volunteers.map((v) => (
              <PublicProfileCard key={v._id} user={v} />
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Available Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
              name="location"
              placeholder="Location"
              onChange={handleChange}
              className="text-black p-2 rounded"
          />
          <select name="category" onChange={handleChange} className="text-black p-2 rounded">
            <option value="">Category</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Social">Social</option>
          </select>
          <select name="format" onChange={handleChange} className="text-black p-2 rounded">
            <option value="">Format</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map((event) => (
              <div key={event.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p>
                    {event.location} | {event.category} | {event.format} | Duration: {event.time}
                  </p>
                </div>
                <button
                    onClick={() => toggleJoin(event.id)}
                    className={`px-4 py-2 rounded ${
                        joinedEvents.includes(event.id)
                            ? "bg-red-400 text-black"
                            : "bg-teal-400 text-black"
                    } hover:opacity-80`}
                >
                  {joinedEvents.includes(event.id) ? "Cancel" : "Join"}
                </button>
              </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-purple-800 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-2">Looking for a Mentor?</h2>
          <p>Explore our mentorship program to learn, grow, and connect.</p>
          <button className="mt-3 px-6 py-2 bg-white text-purple-800 font-semibold rounded hover:bg-purple-100">
            Join Mentorship
          </button>
        </div>
      </div>
  );
}

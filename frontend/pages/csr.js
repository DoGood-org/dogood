"use client";
import { useEffect, useState } from "react";

export default function CSRProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
        organization: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.title = "CSR Programs";
        fetch(`${process.env.NEXT_PUBLIC_API}/csr`)
            .then((res) => res.json())
            .then(setPrograms);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/csr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setPrograms((prev) => [...prev, data]);
                setForm({ title: "", description: "", location: "", date: "", organization: "" });
                setMessage("Program added!");
            } else {
                setMessage(data.message || "Failed to add program");
            }
        } catch (err) {
            setMessage("Submission error");
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Corporate Social Responsibility Programs
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow p-4 mb-8 space-y-3"
            >
                <h2 className="font-semibold">Add CSR Program</h2>
                {message && <p className="text-sm text-green-600">{message}</p>}
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Program Title"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short Description"
                    required
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
                    className="w-full p-2 border rounded"
                />
                <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Organization"
                    required
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                >
                    Submit
                </button>
            </form>

            <div className="space-y-4">
                {programs.map((p, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white rounded shadow hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">{p.organization}</p>
                        <p className="mb-2">{p.description}</p>
                        <p className="text-sm text-gray-500">
                            📍 {p.location} | 📅 {p.date}
                        </p>
                        {p.link && (
                            <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Learn more
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

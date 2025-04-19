"use client"
import { useEffect, useState } from "react";

export default function CSRProgramsPage() {
    const [programs, setPrograms] = useState([
        {
            id: 1,
            company: "EcoCorp",
            title: "Green Office Challenge",
            description: "Encouraging employees to reduce waste and carbon footprint at work.",
            deadline: "Ongoing",
            link: "https://ecocorp.com/csr"
        },
        {
            id: 2,
            company: "Health4All",
            title: "Community Health Initiative",
            description: "Free monthly health checkups for underprivileged communities.",
            deadline: "Until Dec 2025"
        }
    ]);

    useEffect(() => {
        document.title = "CSR Programs";
        // Replace with API call to fetch CSR programs if needed
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Corporate Social Responsibility Programs</h1>

            <div className="space-y-4">
                {programs.map((p) => (
                    <div
                        key={p.id}
                        className="p-4 bg-white rounded shadow hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">by {p.company}</p>
                        <p className="mb-2">{p.description}</p>
                        <p className="text-sm text-gray-500">{p.deadline}</p>
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

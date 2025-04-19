
import React from "react";

const tabs = [
  { key: "tasks", label: "Tasks" },
  { key: "requests", label: "Requests" },
  { key: "profile", label: "Profile" },
];

export default function TopTabs({ active, setActive }) {
  return (
    <div className="flex justify-center gap-4 py-4 bg-gray-800 text-white shadow-md sticky top-0 z-20">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={
            "px-4 py-2 rounded-full transition " +
            (active === tab.key
              ? "bg-teal-400 text-black font-semibold shadow"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

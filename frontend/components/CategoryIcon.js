
import React from "react";

export default function CategoryIcon({ active, label }) {
  return (
    <div
      className={
        "rounded-full px-4 py-1 text-sm transition-all " +
        (active
          ? "bg-teal-400 text-black font-bold shadow-md"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600")
      }
    >
      {label}
    </div>
  );
}

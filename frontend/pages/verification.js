import { useEffect, useState } from "react";

export default function Verification() {
  const [document, setDocument] = useState("");
  const [status, setStatus] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const requestVerification = async () => {
    if (!document.trim()) {
      setStatus("Please provide a valid document link.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/verification/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Verification request submitted successfully.");
        setDocument("");
      } else {
        setStatus(data.error || "Submission failed.");
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Verification Request</h1>

        <div className="bg-white p-6 rounded shadow-md space-y-4">
          <label className="block font-medium">Upload your verification document (URL)</label>
          <input
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="https://..."
              className="w-full p-2 border rounded"
          />

          <button
              onClick={requestVerification}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit for Review
          </button>

          {status && (
              <p className="text-sm text-center text-gray-700 mt-2">{status}</p>
          )}
        </div>
      </div>
  );
}

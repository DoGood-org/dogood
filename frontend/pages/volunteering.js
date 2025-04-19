import { API_URL } from "@/config";
import { useState } from "react";
import Toast from "../components/Toast";

export default function Volunteering() {
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setToast({ message: "Description is required", type: "error" });
      return;
    }

    try {
      const res = await fetch("API_URL/api/volunteering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ message: "Thank you for volunteering!", type: "success" });
        setSubmitted(true);
        setDescription("");
      } else {
        setToast({ message: data.error || "Submission failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Something went wrong", type: "error" });
    }
  };

  return (
      <div className="p-4 md:p-8 max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Become a Volunteer</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
          <label className="block font-medium">Tell us how you'd like to help</label>
          <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I can help with..."
              className="w-full p-2 border rounded"
          />

          <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>

          {toast.message && <Toast message={toast.message} type={toast.type} />}
        </form>

        {submitted && (
            <p className="mt-4 text-center text-green-700 font-medium">
              Your offer has been received. We will contact you soon!
            </p>
        )}
      </div>
  );
}

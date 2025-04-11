// pages/settings.js
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setTheme(data.theme || "dark");
        });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, theme }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      localStorage.setItem("theme", theme);
      setToast({ message: "Settings saved successfully", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="max-w-xl space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-black rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Theme</label>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 text-black rounded"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-400 text-black rounded hover:bg-teal-300"
          >
            Save Settings
          </button>

          {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
      </div>
  );
}

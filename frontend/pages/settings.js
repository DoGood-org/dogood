import { useEffect, useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const storedName = localStorage.getItem("name") || "";
    setTheme(storedTheme);
    setName(storedName);
    setSavedName(storedName);
    document.documentElement.className = storedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  const saveName = () => {
    localStorage.setItem("name", name);
    setSavedName(name);
  };

  return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Settings</h1>

        <div className="bg-white rounded shadow-md p-6 space-y-6">
          <div>
            <label className="block mb-2 font-medium">Display Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button
                onClick={saveName}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Name
            </button>
            {savedName && (
                <p className="text-sm text-gray-600 mt-1">Saved as: {savedName}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Theme</label>
            <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
            >
              Toggle to {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </div>
  );
}

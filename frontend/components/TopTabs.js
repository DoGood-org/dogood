// TopTabs.js
export default function TopTabs({ active, setActive }) {
  const tabs = ["Tasks", "Requests", "Profile"];

  return (
    <div className="flex justify-center gap-6 py-4 bg-white text-black shadow-sm sticky top-0 z-[999]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
            active === tab ? "bg-teal-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
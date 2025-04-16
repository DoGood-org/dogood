// BottomFilterBar.js
import { useEffect, useRef } from "react";
import CategoryIcon from "./CategoryIcon";

const categories = [
  { key: "volunteer", label: "Volunteers" },
  { key: "animals", label: "Animals" },
  { key: "nature", label: "Nature" },
  { key: "education", label: "Education" },
  { key: "medical", label: "Medical" },
  { key: "community", label: "Community" },
];

export default function BottomFilterBar({ active, setActive }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && active) {
      const el = ref.current.querySelector(`[data-key='${active}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [active]);

  return (
    <div className="fixed bottom-4 left-0 w-full px-4 z-[1000]">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto bg-white/90 rounded-full px-4 py-2 backdrop-blur border shadow-md"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            data-key={cat.key}
            onClick={() => setActive(cat.key)}
            className="flex flex-col items-center min-w-[56px]"
          >
            <CategoryIcon label={cat.label} active={active === cat.key} />
            <span className="text-xs mt-1 text-black whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

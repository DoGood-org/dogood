import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
      <button
          onClick={toggleTheme}
          className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:opacity-90 transition"
      >
        {resolvedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
  );
}

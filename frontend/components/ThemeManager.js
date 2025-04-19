
import { useEffect } from "react";

export default function ThemeManager() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}


import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDarkStored = localStorage.getItem('theme') === 'dark';
    setDark(isDarkStored);
    document.documentElement.classList.toggle('dark', isDarkStored);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow"
    >
      {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}

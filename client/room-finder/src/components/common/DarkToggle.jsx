import { useEffect, useState } from "react";

const DarkToggle = () => {
  const [dark, setDark] = useState(() => {
    // Check for saved theme preference in localStorage, fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2
                 px-3 py-1 rounded-full
                 border border-gray-300 dark:border-gray-700
                 bg-gray-200 dark:bg-gray-800
                 text-gray-800 dark:text-gray-200
                 hover:scale-105 transition"
      aria-label="Toggle Dark Mode"
    >
      <span className="text-lg">
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default DarkToggle;
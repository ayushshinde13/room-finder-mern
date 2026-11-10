import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const DarkToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] bg-white dark:bg-[#111A2B] text-[#5B6B7F] hover:text-[#0F1B2D] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] hover:bg-[#F5F8FA] dark:hover:bg-[#162035] transition-colors duration-150 cursor-pointer"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun size={17} strokeWidth={1.75} />
      ) : (
        <Moon size={17} strokeWidth={1.75} />
      )}
    </button>
  );
};

export default DarkToggle;

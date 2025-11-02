import React from "react";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md">
      <h1 className="font-bold text-lg">GenUI</h1>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
      </button>
    </nav>
  );
};

export default Navbar;

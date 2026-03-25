'use client';

import { useThemeStore } from '@/store/themeStore';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FaSun className="text-yellow-400" size={20} />
      ) : (
        <FaMoon className="text-blue-400" size={20} />
      )}
    </button>
  );
}

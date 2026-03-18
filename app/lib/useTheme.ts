/**
 * Theme/Dark Mode Hook
 * Manages light/dark mode switching with localStorage persistence
 */

import { useEffect } from "react";
import { useThemeStore } from "~/lib/store";

export function useTheme() {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return {
    isDark,
    toggleTheme,
    setTheme,
  };
}

/**
 * Get CSS class based on theme
 */
export function useThemeClass(lightClass: string, darkClass: string): string {
  const isDark = useThemeStore((state) => state.isDark);
  return isDark ? darkClass : lightClass;
}

/**
 * Color utilities for theme-aware colors
 */
export const themeColors = {
  light: {
    bg: "bg-gray-50",
    bgCard: "bg-white",
    text: "text-gray-900",
    textMuted: "text-gray-600",
    border: "border-gray-200",
  },
  dark: {
    bg: "bg-gray-900",
    bgCard: "bg-gray-800",
    text: "text-white",
    textMuted: "text-gray-400",
    border: "border-gray-700",
  },
};

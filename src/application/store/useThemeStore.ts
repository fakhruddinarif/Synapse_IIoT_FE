import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

/** Represents the persisted theme preference and resolved value. */
export interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyThemeClass = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(resolved);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "dark",
      resolved: "dark",
      setMode: (mode) => {
        const resolved = mode === "system" ? getSystemTheme() : mode;
        set({ mode, resolved });
        applyThemeClass(resolved);
      },
      toggle: () => {
        const next = get().resolved === "dark" ? "light" : "dark";
        set({ mode: next, resolved: next });
        applyThemeClass(next);
      },
    }),
    {
      name: "synapse-theme",
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

export const syncResolvedTheme = (resolved: ResolvedTheme) => {
  applyThemeClass(resolved);
  useThemeStore.setState({ resolved });
};

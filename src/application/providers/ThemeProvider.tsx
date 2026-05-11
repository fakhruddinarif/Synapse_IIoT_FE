import type { ReactNode } from "react";
import { useEffect } from "react";
import { useThemeStore, syncResolvedTheme } from "../store/useThemeStore";

/** Applies the theme class to <html> and keeps system mode in sync. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const resolved = useThemeStore((state) => state.resolved);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    if (mode !== "system") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      syncResolvedTheme(media.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    handler();

    return () => media.removeEventListener("change", handler);
  }, [mode]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const body = document.body;
    const id = window.setTimeout(() => {
      body.classList.add("theme-transition");
    }, 0);

    return () => window.clearTimeout(id);
  }, [resolved]);

  return <>{children}</>;
};

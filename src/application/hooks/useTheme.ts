import { useMemo } from "react";
import { useThemeStore } from "../store/useThemeStore";

/** Returns the theme mode, resolved value, and helpers. */
export const useTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  const resolved = useThemeStore((state) => state.resolved);
  const setMode = useThemeStore((state) => state.setMode);
  const toggle = useThemeStore((state) => state.toggle);

  return useMemo(
    () => ({
      mode,
      resolved,
      setMode,
      toggle,
      isDark: resolved === "dark",
      isLight: resolved === "light",
    }),
    [mode, resolved, setMode, toggle],
  );
};

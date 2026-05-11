import { useTheme } from "./useTheme";

export interface ChartThemeConfig {
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  lineColors: string[];
}

/** Returns a Recharts theme palette based on current UI mode. */
export const useChartTheme = (): ChartThemeConfig => {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  return {
    backgroundColor: "transparent",
    gridColor: isDark ? "#1E3A4A" : "#CBD5E0",
    textColor: isDark ? "#8BA3B8" : "#475569",
    tooltipBg: isDark ? "#1A2332" : "#FFFFFF",
    tooltipBorder: isDark ? "#1E3A4A" : "#CBD5E0",
    lineColors: ["#00D4FF", "#10B981", "#F59E0B", "#8B5CF6"],
  };
};

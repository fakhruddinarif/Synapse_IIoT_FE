import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    "text-status-online",
    "text-status-warning",
    "text-status-alarm",
    "text-status-offline",
    "text-status-unknown",
    "text-status-idle",
    "bg-status-online",
    "bg-status-warning",
    "bg-status-alarm",
    "bg-status-offline",
    "bg-status-unknown",
    "bg-status-idle",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-bg-canvas)",
        surface: "var(--color-bg-surface)",
        elevated: "var(--color-bg-elevated)",
        overlay: "var(--color-bg-overlay)",
        subtle: "var(--color-bg-subtle)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
        inverse: "var(--color-text-inverse)",
        brand: "var(--color-text-brand)",
        "border-default": "var(--color-border-default)",
        "border-muted": "var(--color-border-muted)",
        "border-strong": "var(--color-border-strong)",
        "status-online": "var(--color-status-online)",
        "status-warning": "var(--color-status-warning)",
        "status-alarm": "var(--color-status-alarm)",
        "status-offline": "var(--color-status-offline)",
        "status-unknown": "var(--color-status-unknown)",
        "status-idle": "var(--color-status-idle)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        numeric: ["var(--font-numeric)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        "glow-amber": "var(--shadow-glow-amber)",
        "glow-rose": "var(--shadow-glow-rose)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 0 rgba(244, 63, 94, 0)" },
          "50%": { boxShadow: "0 0 16px rgba(244, 63, 94, 0.5)" },
          "100%": { boxShadow: "0 0 0 rgba(244, 63, 94, 0)" },
        },
        "data-flash": {
          "0%": { backgroundColor: "transparent" },
          "40%": { backgroundColor: "var(--color-brand-faint)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "glow-pulse": "glow-pulse 1.2s ease-in-out infinite",
        "data-flash": "data-flash 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "@app/hooks";
import { cn } from "@shared/utils";
import { Dropdown } from "../Dropdown";

export type ThemeToggleVariant = "icon-button" | "segmented" | "dropdown";

export interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
}

const options = [
  { mode: "dark" as const, label: "Dark", icon: Moon },
  { mode: "light" as const, label: "Light", icon: Sun },
  { mode: "system" as const, label: "System", icon: Monitor },
];

/** Switches between dark, light, and system themes. */
export const ThemeToggle = ({ variant = "icon-button" }: ThemeToggleProps) => {
  const { mode, setMode } = useTheme();

  const activeIndex = useMemo(
    () => options.findIndex((option) => option.mode === mode),
    [mode],
  );

  const cycleMode = () => {
    const next = options[(activeIndex + 1) % options.length].mode;
    setMode(next);
  };

  if (variant === "segmented") {
    return (
      <div className="relative flex rounded-full border border-default bg-subtle p-1">
        <motion.div
          layoutId="theme-indicator"
          className="absolute inset-y-1 w-24 translate-x-[var(--indicator-x)] rounded-full bg-[var(--color-brand-primary)]"
          style={{ "--indicator-x": `${activeIndex * 96}px` } as CSSProperties}
        />
        {options.map((option) => (
          <button
            key={option.mode}
            onClick={() => setMode(option.mode)}
            className={cn(
              "relative z-10 flex w-24 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition",
              option.mode === mode ? "text-inverse" : "text-secondary",
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "dropdown") {
    const active = options[activeIndex];
    return (
      <Dropdown
        trigger={
          <button className="flex items-center gap-2 rounded-md border border-default bg-surface px-3 py-2 text-sm text-secondary">
            <active.icon className="h-4 w-4" />
            {active.label}
          </button>
        }
      >
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.mode}
              onClick={() => setMode(option.mode)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-secondary hover:bg-subtle",
                option.mode === mode && "text-brand",
              )}
            >
              <span className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                {option.label}
              </span>
              {option.mode === mode && <span>✓</span>}
            </button>
          ))}
        </div>
      </Dropdown>
    );
  }

  const Icon = options[activeIndex].icon;
  return (
    <button
      onClick={cycleMode}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-default bg-surface text-secondary hover:text-brand"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

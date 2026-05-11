import type { CSSProperties } from "react";
import { cn } from "@shared/utils";

export interface ProgressBarProps {
  value: number;
  className?: string;
}

/** Linear progress indicator. */
export const ProgressBar = ({ value, className }: ProgressBarProps) => (
  <div
    className={cn("h-2 w-full rounded-full bg-subtle", className)}
    style={
      { "--progress": `${Math.min(100, Math.max(0, value))}%` } as CSSProperties
    }
  >
    <div className="h-full rounded-full bg-[var(--color-brand-primary)] transition-all w-[var(--progress)]" />
  </div>
);

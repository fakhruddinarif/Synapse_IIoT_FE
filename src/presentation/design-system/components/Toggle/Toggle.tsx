import type { InputHTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/** Switch toggle control. */
export const Toggle = ({ label, className, ...props }: ToggleProps) => (
  <label className={cn("flex items-center gap-3", className)}>
    <input type="checkbox" className="peer sr-only" {...props} />
    <span
      className={cn(
        "relative h-6 w-10 rounded-full bg-subtle transition",
        "peer-checked:bg-[var(--color-brand-primary)]",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-4 w-4 rounded-full bg-surface transition",
          "peer-checked:translate-x-4",
        )}
      />
    </span>
    {label && <span className="text-sm text-secondary">{label}</span>}
  </label>
);

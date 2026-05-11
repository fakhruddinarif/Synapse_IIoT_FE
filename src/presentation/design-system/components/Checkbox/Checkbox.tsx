import type { InputHTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Checkbox control with label. */
export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
  <label
    className={cn("flex items-center gap-2 text-sm text-secondary", className)}
  >
    <input
      type="checkbox"
      className="h-4 w-4 rounded border border-default bg-surface text-brand focus:ring-2 focus:ring-[var(--color-brand-glow)]"
      {...props}
    />
    <span>{label}</span>
  </label>
);

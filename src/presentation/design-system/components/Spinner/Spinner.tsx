import { cn } from "@shared/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3 border-2",
  md: "h-4 w-4 border-2",
  lg: "h-6 w-6 border-2",
};

/** Loading spinner with theme-aware colors. */
export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <span
    className={cn(
      "inline-block animate-spin rounded-full border border-[var(--color-text-muted)] border-t-[var(--color-brand-primary)]",
      sizeMap[size],
      className,
    )}
  />
);

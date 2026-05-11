import { cn } from "@shared/utils";

export interface DividerProps {
  className?: string;
}

/** Section divider line. */
export const Divider = ({ className }: DividerProps) => (
  <div
    className={cn("h-px w-full bg-[var(--color-border-muted)]", className)}
  />
);

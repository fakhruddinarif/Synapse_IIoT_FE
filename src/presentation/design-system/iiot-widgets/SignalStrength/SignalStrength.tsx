import { cn } from "@shared/utils";

export interface SignalStrengthProps {
  level: 1 | 2 | 3 | 4 | 5;
}

const heights = ["h-2", "h-3", "h-4", "h-5", "h-6"];

/** Signal strength bars. */
export const SignalStrength = ({ level }: SignalStrengthProps) => (
  <div className="flex items-end gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={cn(
          "w-1 rounded-sm bg-subtle",
          index < level && "bg-[var(--color-brand-primary)]",
          heights[index],
        )}
      />
    ))}
  </div>
);

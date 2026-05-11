import type { TagQuality } from "@shared/types";
import { cn } from "@shared/utils";

export interface TagValueDisplayProps {
  tagId: string;
  value: string | number | boolean;
  unit?: string;
  quality: TagQuality;
  label?: string;
  size?: "sm" | "md" | "lg";
  trend?: "up" | "down" | "flat";
}

const sizeStyles = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const qualityColors: Record<TagQuality, string> = {
  Good: "text-status-online",
  Bad: "text-status-alarm",
  Uncertain: "text-status-warning",
};

/** Live tag value with quality and trend indicator. */
export const TagValueDisplay = ({
  value,
  unit,
  quality,
  label,
  size = "md",
  trend = "flat",
}: TagValueDisplayProps) => (
  <div className="space-y-1">
    {label && <div className="text-xs text-muted">{label}</div>}
    <div className="flex items-baseline gap-2">
      <span className={cn("font-mono text-primary", sizeStyles[size])}>
        {value}
      </span>
      {unit && <span className="text-sm text-secondary">{unit}</span>}
      <span className={cn("text-xs", qualityColors[quality])}>●</span>
      <span
        className={cn(
          "text-xs",
          trend === "up" && "text-status-online",
          trend === "down" && "text-status-warning",
          trend === "flat" && "text-muted",
        )}
      >
        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
      </span>
    </div>
  </div>
);

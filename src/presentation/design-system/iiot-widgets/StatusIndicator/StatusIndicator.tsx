import { cn } from "@shared/utils";
import type { DeviceStatus } from "@shared/types";

export interface StatusIndicatorProps {
  status: DeviceStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

const statusClassMap: Record<DeviceStatus, string> = {
  ONLINE: "text-status-online",
  OFFLINE: "text-status-offline",
  WARNING: "text-status-warning",
  ALARM: "text-status-alarm",
  IDLE: "text-status-idle",
  UNKNOWN: "text-status-unknown",
};

/** LED-style status dot with optional label. */
export const StatusIndicator = ({
  status,
  size = "md",
  showLabel = false,
  label,
}: StatusIndicatorProps) => (
  <div className="flex items-center gap-2">
    <span className={cn("relative flex", statusClassMap[status])}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full bg-current opacity-40",
          (status === "ONLINE" || status === "ALARM") && "animate-pulse-ring",
        )}
      />
      <span className={cn("relative rounded-full bg-current", sizeMap[size])} />
    </span>
    {showLabel && (
      <span className="text-xs text-secondary">{label ?? status}</span>
    )}
  </div>
);

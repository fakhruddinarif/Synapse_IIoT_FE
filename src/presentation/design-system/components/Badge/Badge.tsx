import { cn } from "@shared/utils";

export interface BadgeProps {
  variant:
    | "online"
    | "offline"
    | "warning"
    | "alarm"
    | "idle"
    | "unknown"
    | "info";
  size?: "sm" | "md";
  pulse?: boolean;
  label?: string;
}

const variantStyles: Record<BadgeProps["variant"], string> = {
  online: "text-status-online",
  offline: "text-status-offline",
  warning: "text-status-warning",
  alarm: "text-status-alarm",
  idle: "text-status-idle",
  unknown: "text-status-unknown",
  info: "text-brand",
};

/** Status badge with optional pulse ring. */
export const Badge = ({
  variant,
  size = "sm",
  pulse = false,
  label,
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border border-default px-2.5 py-1",
      size === "md" && "text-sm",
      size === "sm" && "text-xs",
      variantStyles[variant],
    )}
  >
    <span className="relative flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full bg-current opacity-50",
          pulse && "animate-pulse-ring",
        )}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
    {label ?? variant}
  </span>
);

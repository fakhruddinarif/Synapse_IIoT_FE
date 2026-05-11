import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: "block" | "text" | "circle";
}

/** Base shimmer skeleton block. */
export const Skeleton = ({
  width = "100%",
  height = "1rem",
  borderRadius = "var(--radius-md)",
  variant = "block",
  className,
  ...props
}: SkeletonProps) => {
  const styles = {
    "--skeleton-width": width,
    "--skeleton-height": height,
    "--skeleton-radius": variant === "circle" ? "9999px" : borderRadius,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--skeleton-base)]",
        "w-[var(--skeleton-width)] h-[var(--skeleton-height)] rounded-[var(--skeleton-radius)]",
        "after:absolute after:inset-0",
        "after:bg-[linear-gradient(90deg,var(--skeleton-base),var(--skeleton-highlight),var(--skeleton-base))]",
        "after:bg-[length:200%_100%] after:animate-shimmer",
        variant === "text" && "h-3",
        className,
      )}
      style={styles}
      {...props}
    />
  );
};

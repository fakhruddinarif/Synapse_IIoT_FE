import type { ComponentType, HTMLAttributes, CSSProperties } from "react";
import { cn } from "@shared/utils";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  as: ComponentType<{ className?: string }>;
  size?: number;
}

/** Icon wrapper with consistent sizing. */
export const Icon = ({
  as: IconComponent,
  size = 18,
  className,
  ...props
}: IconProps) => (
  <span
    className={cn(
      "inline-flex items-center justify-center w-[var(--icon-size)] h-[var(--icon-size)]",
      className,
    )}
    style={{ "--icon-size": `${size}px` } as CSSProperties}
    {...props}
  >
    <IconComponent className="w-full h-full" />
  </span>
);

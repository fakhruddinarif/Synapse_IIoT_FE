import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: "primary" | "secondary" | "muted" | "brand" | "inverse";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  mono?: boolean;
}

const sizeStyles: Record<NonNullable<TextProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const toneStyles: Record<NonNullable<TextProps["tone"]>, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted",
  brand: "text-brand",
  inverse: "text-inverse",
};

/** Base typography component. */
export const Text = ({
  as: Component = "p",
  className,
  tone = "primary",
  size = "md",
  mono = false,
  ...props
}: TextProps) => (
  <Component
    className={cn(
      toneStyles[tone],
      sizeStyles[size],
      mono && "font-mono",
      className,
    )}
    {...props}
  />
);

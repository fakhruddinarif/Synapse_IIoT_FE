import type { ReactNode } from "react";
import { cn } from "@shared/utils";
import { SkeletonCard } from "../../skeleton/SkeletonCard";

export interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "elevated" | "interactive" | "alarm";
  noPadding?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-elevated border border-default",
  elevated: "bg-overlay border border-default shadow-md",
  interactive: "bg-elevated border border-default hover:shadow-md transition",
  alarm:
    "bg-elevated border border-default border-l-4 border-l-[var(--color-accent-rose)]",
};

/** Surface card with optional header and footer. */
export const Card = ({
  header,
  footer,
  variant = "default",
  noPadding = false,
  loading = false,
  children,
  className,
}: CardProps) => {
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div
      className={cn(
        "rounded-lg",
        variantStyles[variant],
        !noPadding && "p-4",
        className,
      )}
    >
      {header && <div className="mb-3 text-sm text-secondary">{header}</div>}
      {children}
      {footer && <div className="mt-4 text-xs text-muted">{footer}</div>}
    </div>
  );
};

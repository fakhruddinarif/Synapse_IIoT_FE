import type { ReactNode } from "react";
import { cn } from "@shared/utils";

export interface AlertProps {
  variant?: "info" | "warning" | "error" | "success";
  title: string;
  description?: ReactNode;
}

const variantStyles = {
  info: "border-brand text-brand",
  warning: "border-status-warning text-status-warning",
  error: "border-status-alarm text-status-alarm",
  success: "border-status-online text-status-online",
};

/** Inline alert banner. */
export const Alert = ({ variant = "info", title, description }: AlertProps) => (
  <div className={cn("rounded-md border px-4 py-3", variantStyles[variant])}>
    <div className="text-sm font-medium">{title}</div>
    {description && (
      <div className="mt-1 text-xs text-secondary">{description}</div>
    )}
  </div>
);

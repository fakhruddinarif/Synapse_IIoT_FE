import type { ReactNode } from "react";
import { Button } from "../Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

/** Zero-data placeholder for panels and pages. */
export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-elevated p-8 text-center">
    {icon && <div className="mb-4 text-brand">{icon}</div>}
    <h3 className="text-lg font-semibold text-primary">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-secondary">{description}</p>
    {actionLabel && onAction && (
      <div className="mt-4">
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    )}
  </div>
);

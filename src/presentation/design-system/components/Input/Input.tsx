import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@shared/utils";

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const baseClasses =
  "w-full rounded-md border border-default bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-strong focus:outline-none";

/** Base text input. */
export const TextInput = ({
  label,
  error,
  icon,
  className,
  ...props
}: BaseInputProps) => (
  <label className="block space-y-1 text-sm text-secondary">
    {label && <span>{label}</span>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
      )}
      <input
        className={cn(baseClasses, icon && "pl-9", className)}
        type="text"
        {...props}
      />
    </div>
    {error && <span className="text-xs text-status-alarm">{error}</span>}
  </label>
);

/** Numeric input. */
export const NumberInput = (props: BaseInputProps) => (
  <TextInput {...props} type="number" />
);

/** Search input with built-in type. */
export const SearchInput = (props: BaseInputProps) => (
  <TextInput {...props} type="search" />
);

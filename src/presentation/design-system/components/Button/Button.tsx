import { cn } from "@shared/utils";
import { Spinner } from "../Spinner";
import type { ButtonProps } from "./Button.types";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--color-brand-primary)] text-inverse shadow-glow hover:bg-[var(--color-brand-secondary)]",
  secondary: "bg-elevated text-primary border border-default hover:bg-subtle",
  ghost: "bg-transparent text-primary hover:bg-subtle",
  danger:
    "bg-[var(--color-accent-rose)] text-inverse shadow-glow-rose hover:animate-glow-pulse",
  outline: "bg-transparent text-primary border border-strong hover:bg-subtle",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "text-xs px-2.5 py-1.5",
  sm: "text-sm px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

/** Primary action button. */
export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const isIconOnly = !children;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition",
        "active:scale-[0.97]",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        isIconOnly && "aspect-square p-2",
        (disabled || loading) && "opacity-60 pointer-events-none",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

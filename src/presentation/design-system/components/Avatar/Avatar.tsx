import { cn } from "@shared/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

/** User avatar with initials fallback. */
export const Avatar = ({ name, src, size = "md" }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-default bg-subtle text-primary",
        sizeStyles[size],
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full" />
      ) : (
        initials
      )}
    </div>
  );
};

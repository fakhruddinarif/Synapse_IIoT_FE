import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/** Grid layout container. */
export const Grid = ({
  as: Component = "div",
  className,
  ...props
}: GridProps) => <Component className={cn("grid", className)} {...props} />;

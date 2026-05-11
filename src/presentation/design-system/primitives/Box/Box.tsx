import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/** Generic layout container. */
export const Box = ({
  as: Component = "div",
  className,
  ...props
}: BoxProps) => <Component className={cn("", className)} {...props} />;

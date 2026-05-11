import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@shared/utils";

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/** Flexbox layout container. */
export const Flex = ({
  as: Component = "div",
  className,
  ...props
}: FlexProps) => <Component className={cn("flex", className)} {...props} />;

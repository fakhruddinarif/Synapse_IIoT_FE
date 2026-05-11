import { useState, type ReactNode } from "react";
import {
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

/** Floating tooltip with lightweight hover behavior. */
export const Tooltip = ({ content, children }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), shift({ padding: 6 })],
  });
  const hover = useHover(context, { move: false, delay: 150 });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 rounded-md border border-default bg-overlay px-2 py-1 text-xs text-primary shadow-md"
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

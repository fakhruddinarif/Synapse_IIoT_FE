import { useState, type ReactNode } from "react";
import {
  FloatingPortal,
  offset,
  shift,
  useClick,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
}

/** Click-triggered popover panel. */
export const Popover = ({ trigger, content }: PopoverProps) => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), shift({ padding: 8 })],
  });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 rounded-lg border border-default bg-overlay p-4 shadow-lg"
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

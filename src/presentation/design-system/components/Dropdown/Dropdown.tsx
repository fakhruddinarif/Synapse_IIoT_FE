import { useState, type ReactNode } from "react";
import {
  FloatingPortal,
  offset,
  shift,
  useClick,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

/** Dropdown menu container. */
export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), shift({ padding: 8 })],
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
            className="z-50 min-w-[180px] rounded-lg border border-default bg-overlay p-2 shadow-lg"
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

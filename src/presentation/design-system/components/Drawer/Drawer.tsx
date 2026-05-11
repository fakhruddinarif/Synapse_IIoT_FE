import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Side drawer for auxiliary panels. */
export const Drawer = ({ open, onClose, children }: DrawerProps) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 h-full w-full max-w-md border-l border-default bg-overlay p-6 shadow-lg">
        {children}
      </div>
    </div>,
    document.body,
  );
};

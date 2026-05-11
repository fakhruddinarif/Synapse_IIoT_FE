import { Toaster } from "sonner";

/** Global toast host (Sonner). */
export const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        background: "var(--color-bg-overlay)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border-default)",
      },
    }}
  />
);

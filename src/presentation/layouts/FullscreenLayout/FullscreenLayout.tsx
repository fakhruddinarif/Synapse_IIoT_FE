import type { ReactNode } from "react";

export interface FullscreenLayoutProps {
  children: ReactNode;
}

/** Chrome-less fullscreen layout for SCADA displays. */
const FullscreenLayout = ({ children }: FullscreenLayoutProps) => (
  <div className="min-h-screen bg-canvas text-primary">{children}</div>
);

export default FullscreenLayout;

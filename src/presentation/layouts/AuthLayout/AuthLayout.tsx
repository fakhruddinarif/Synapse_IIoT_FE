import type { ReactNode } from "react";
import { ThemeToggle } from "@ui/components";
import { useTheme } from "@app/hooks";
import { cn } from "@shared/utils";

export interface AuthLayoutProps {
  children: ReactNode;
}

/** Auth layout with split branding panel. */
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen bg-canvas text-primary">
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle variant="icon-button" />
      </div>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div
          className={cn(
            "relative hidden flex-col justify-between overflow-hidden border-r border-default p-12 lg:flex",
            isDark
              ? "bg-[var(--color-bg-surface)]"
              : "bg-[var(--color-bg-elevated)]",
          )}
        >
          <div>
            <div className="text-sm text-brand">Synapse IIoT</div>
            <h1 className="mt-4 text-3xl font-semibold">
              Industrial Data, Reimagined
            </h1>
            <p className="mt-2 max-w-md text-sm text-secondary">
              Connect MODBUS, OPC-UA, and MQTT devices into a unified, real-time
              control plane.
            </p>
          </div>
          <div className="text-xs text-muted">
            Secure gateway • Real-time telemetry • SCADA-ready
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.2),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)] animate-[glow-sweep_6s_infinite]" />
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-xl border border-default bg-surface p-8 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

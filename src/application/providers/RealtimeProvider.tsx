import type { ReactNode } from "react";
import { SignalRProvider } from "@infra/realtime/signalr/SignalRContext";

/** Provides real-time connections to the app. */
export const RealtimeProvider = ({ children }: { children: ReactNode }) => (
  <SignalRProvider>{children}</SignalRProvider>
);

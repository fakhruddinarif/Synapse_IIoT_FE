import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useAuthStore } from "@app/store/useAuthStore";
import { useGatewayStore } from "@app/store/useGatewayStore";
import { SignalRClient } from "./SignalRClient";

interface SignalRContextValue {
  connection: SignalRClient;
  connectionState: HubConnectionState;
  isConnected: boolean;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextValue | null>(null);

const hubUrl =
  import.meta.env.VITE_SIGNALR_HUB_URL ??
  "http://localhost:5009/signalr/device-hub";

/** Provides a single SignalR connection instance. */
export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setConnectionState = useGatewayStore(
    (state) => state.setConnectionState,
  );
  const connectionState = useGatewayStore((state) => state.connectionState);
  const incrementReconnectAttempts = useGatewayStore(
    (state) => state.incrementReconnectAttempts,
  );
  const resetReconnectAttempts = useGatewayStore(
    (state) => state.resetReconnectAttempts,
  );

  const client = useMemo(
    () => new SignalRClient(hubUrl, setConnectionState),
    [setConnectionState],
  );

  const startConnection = useCallback(async () => {
    try {
      await client.start();
      resetReconnectAttempts();
    } catch {
      incrementReconnectAttempts();
    }
  }, [client, incrementReconnectAttempts, resetReconnectAttempts]);

  const stopConnection = useCallback(async () => {
    await client.stop();
  }, [client]);

  useEffect(() => {
    if (isAuthenticated) {
      startConnection();
      return () => {
        stopConnection();
      };
    }
    stopConnection();
    return undefined;
  }, [isAuthenticated, startConnection, stopConnection]);

  const value = useMemo(
    () => ({
      connection: client,
      connectionState,
      isConnected: connectionState === HubConnectionState.Connected,
      startConnection,
      stopConnection,
    }),
    [client, connectionState, startConnection, stopConnection],
  );

  return (
    <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("SignalRContext must be used within SignalRProvider");
  }
  return context;
};

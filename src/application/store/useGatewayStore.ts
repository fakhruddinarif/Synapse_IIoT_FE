import { create } from "zustand";
import { HubConnectionState } from "@microsoft/signalr";

/** SignalR connection health state. */
export interface GatewayState {
  connectionState: HubConnectionState;
  isConnected: boolean;
  reconnectAttempts: number;
  lastConnectedAt: Date | null;
  lastDisconnectedAt: Date | null;
  setConnectionState: (state: HubConnectionState) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useGatewayStore = create<GatewayState>((set) => ({
  connectionState: HubConnectionState.Disconnected,
  isConnected: false,
  reconnectAttempts: 0,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  setConnectionState: (connectionState) =>
    set((state) => ({
      connectionState,
      isConnected: connectionState === HubConnectionState.Connected,
      lastConnectedAt:
        connectionState === HubConnectionState.Connected
          ? new Date()
          : state.lastConnectedAt,
      lastDisconnectedAt:
        connectionState === HubConnectionState.Disconnected
          ? new Date()
          : state.lastDisconnectedAt,
    })),
  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
}));

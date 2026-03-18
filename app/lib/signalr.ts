/**
 * SignalR Real-time Connection Service
 * Manages WebSocket connection to backend for real-time device data
 */

import * as signalR from "@microsoft/signalr";
import { useTagStore, useDeviceStore, useRealtimeStore } from "~/lib/store";

let connection: signalR.HubConnection | null = null;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const HUB_URL = `${API_BASE_URL}/signalr/device-hub`;

/**
 * Initialize SignalR connection
 */
export async function initializeSignalR(): Promise<signalR.HubConnection | null> {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  const realtimeStore = useRealtimeStore.getState();
  realtimeStore.setConnecting(true);

  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(
        import.meta.env.DEV
          ? signalR.LogLevel.Information
          : signalR.LogLevel.Error,
      )
      .build();

    // Register event handlers
    setupConnectionHandlers(connection);

    // Start connection
    await connection.start();
    console.log("✅ SignalR connected");
    realtimeStore.setConnected(true);
    realtimeStore.setConnecting(false);
  } catch (error) {
    console.error("❌ SignalR connection failed:", error);
    realtimeStore.setConnecting(false);
    setTimeout(() => initializeSignalR(), 5000);
  }

  return connection;
}

/**
 * Setup SignalR event handlers
 */
function setupConnectionHandlers(conn: signalR.HubConnection) {
  // Receive real-time device data
  conn.on("ReceiveDeviceData", (deviceId: string, tagDataArray: any[]) => {
    const updateTagData = useTagStore.getState().updateTagData;
    const setLastUpdate = useRealtimeStore.getState().setLastUpdate;

    tagDataArray.forEach((tag: any) => {
      updateTagData(tag.tagId, {
        tagId: tag.tagId,
        tagName: tag.name,
        deviceId: deviceId,
        currentEngValue: Number.parseFloat(tag.currentEngValue),
        currentRawValue: Number.parseFloat(tag.currentRawValue),
        unit: tag.unit,
        updatedAt: new Date(tag.valueUpdatedAt),
      });
    });

    setLastUpdate(new Date());
  });

  // Device status change
  conn.on("DeviceStatusChanged", (deviceId: string, isOnline: boolean) => {
    const updateDeviceStatus = useDeviceStore.getState().updateDeviceStatus;
    updateDeviceStatus(deviceId, isOnline);
    console.log(`Device ${deviceId} is now ${isOnline ? "ONLINE" : "OFFLINE"}`);
  });

  // Connection state changes
  conn.onreconnecting(() => {
    console.log("⏳ SignalR reconnecting...");
    useRealtimeStore.getState().setConnected(false);
  });

  conn.onreconnected(() => {
    console.log("✅ SignalR reconnected");
    useRealtimeStore.getState().setConnected(true);
  });

  conn.onclose(() => {
    console.log("❌ SignalR disconnected");
    useRealtimeStore.getState().setConnected(false);
  });
}

/**
 * Subscribe to specific device data
 */
export async function subscribeToDevice(deviceId: string): Promise<void> {
  if (!connection) {
    await initializeSignalR();
  }

  if (connection?.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.invoke("SubscribeToDevice", deviceId);
      console.log(`Subscribed to device: ${deviceId}`);
    } catch (error) {
      console.error(`Failed to subscribe to device ${deviceId}:`, error);
    }
  }
}

/**
 * Unsubscribe from device data
 */
export async function unsubscribeFromDevice(deviceId: string): Promise<void> {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.invoke("UnsubscribeFromDevice", deviceId);
      console.log(`Unsubscribed from device: ${deviceId}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from device ${deviceId}:`, error);
    }
  }
}

/**
 * Subscribe to all devices
 */
export async function subscribeToAllDevices(): Promise<void> {
  if (!connection) {
    await initializeSignalR();
  }

  if (connection?.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.invoke("SubscribeToAllDevices");
      console.log("Subscribed to all devices");
    } catch (error) {
      console.error("Failed to subscribe to all devices:", error);
    }
  }
}

/**
 * Disconnect from SignalR
 */
export async function disconnectSignalR(): Promise<void> {
  if (connection) {
    try {
      await connection.stop();
      console.log("SignalR disconnected");
      useRealtimeStore.getState().setConnected(false);
    } catch (error) {
      console.error("Error disconnecting SignalR:", error);
    }
    connection = null;
  }
}

/**
 * Get connection instance
 */
export function getConnection(): signalR.HubConnection | null {
  return connection;
}

/**
 * Check if connected
 */
export function isConnected(): boolean {
  return connection?.state === signalR.HubConnectionState.Connected || false;
}

/**
 * Hook to auto-initialize SignalR and manage lifecycle
 */
export function useSignalR() {
  const isConnected = useRealtimeStore((state) => state.isConnected);
  const isConnecting = useRealtimeStore((state) => state.isConnecting);

  return {
    isConnected,
    isConnecting,
    initialize: initializeSignalR,
    subscribe: subscribeToDevice,
    unsubscribe: unsubscribeFromDevice,
    subscribeAll: subscribeToAllDevices,
    disconnect: disconnectSignalR,
  };
}

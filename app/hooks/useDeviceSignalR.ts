import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { DeviceData } from "~/types/device";

const HUB_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5009"}/hubs/device-data`;

export function useDeviceSignalR() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<Map<string, DeviceData[]>>(
    new Map(),
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug: Log the HUB_URL
  useEffect(() => {
    console.log("SignalR Hub URL:", HUB_URL);
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  }, []);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: false,
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected");
          setIsConnected(true);
        })
        .catch((err) => {
          console.error("SignalR Connection Error: ", err);
          setIsConnected(false);
          // Retry connection after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connection.start().catch(console.error);
          }, 5000);
        });

      connection.on("ReceiveDeviceData", (data: DeviceData) => {
        console.log("Received device data:", data);
        setDeviceData((prevData) => {
          const newData = new Map(prevData);
          const deviceHistory = newData.get(data.deviceId) || [];

          // FIFO - Keep only last 10 data points
          const updatedHistory = [...deviceHistory, data].slice(-10);
          newData.set(data.deviceId, updatedHistory);

          return newData;
        });
      });

      connection.on("Connected", (message: string) => {
        console.log("Hub message:", message);
      });

      connection.onreconnecting(() => {
        console.log("SignalR Reconnecting...");
        setIsConnected(false);
      });

      connection.onreconnected(() => {
        console.log("SignalR Reconnected");
        setIsConnected(true);
      });

      connection.onclose(() => {
        console.log("SignalR Disconnected");
        setIsConnected(false);
      });
    }
  }, [connection]);

  const subscribeToDevice = useCallback(
    async (deviceId: string) => {
      if (connection && isConnected) {
        try {
          await connection.invoke("SubscribeToDevice", deviceId);
          console.log(`Subscribed to device: ${deviceId}`);
        } catch (err) {
          console.error("Error subscribing to device:", err);
        }
      }
    },
    [connection, isConnected],
  );

  const unsubscribeFromDevice = useCallback(
    async (deviceId: string) => {
      if (connection && isConnected) {
        try {
          await connection.invoke("UnsubscribeFromDevice", deviceId);
          console.log(`Unsubscribed from device: ${deviceId}`);
        } catch (err) {
          console.error("Error unsubscribing from device:", err);
        }
      }
    },
    [connection, isConnected],
  );

  const clearDeviceData = useCallback((deviceId: string) => {
    setDeviceData((prevData) => {
      const newData = new Map(prevData);
      newData.delete(deviceId);
      return newData;
    });
  }, []);

  return {
    isConnected,
    deviceData,
    subscribeToDevice,
    unsubscribeFromDevice,
    clearDeviceData,
  };
}

import {
  HubConnectionBuilder,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import { API_BASE_URL } from "./http";

export const createDeviceHubConnection = () =>
  new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/signalr/device-hub`, { withCredentials: true })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect([0, 1000, 2000, 5000])
    .build();

export const subscribeToDevice = async (
  connection: HubConnection,
  deviceId: string,
) => connection.invoke("SubscribeToDevice", deviceId);

export type DeviceStreamEvent = {
  deviceId: string;
  deviceName: string;
  protocol: string;
  data: Record<string, unknown>;
  timestamp: string;
  status: string;
  message?: string | null;
};

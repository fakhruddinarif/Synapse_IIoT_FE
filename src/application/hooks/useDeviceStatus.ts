import { useEffect } from "react";
import { useSignalR } from "@infra/realtime/signalr/useSignalR";
import { useDeviceStore } from "../store/useDeviceStore";
import type { DeviceStatusPayload } from "@shared/types";

/** Subscribes to live device status updates. */
export const useDeviceStatus = () => {
  const { subscribe } = useSignalR();
  const setDeviceStatus = useDeviceStore((state) => state.setDeviceStatus);

  useEffect(() => {
    return subscribe("ReceiveDeviceStatus", (payload: DeviceStatusPayload) => {
      setDeviceStatus(payload.deviceId, payload);
    });
  }, [setDeviceStatus, subscribe]);
};

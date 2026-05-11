import { useEffect } from "react";
import { useSignalR } from "@infra/realtime/signalr/useSignalR";
import { useTagStore } from "../store/useTagStore";
import type { DeviceDataPayload } from "@shared/types";

/** Subscribes to a single tag value from SignalR. */
export const useRealTimeTag = (deviceId: string, tagId: string) => {
  const { subscribe, invoke } = useSignalR();
  const setTagValue = useTagStore((state) => state.setTagValue);

  useEffect(() => {
    const unsubscribe = subscribe(
      "ReceiveDeviceData",
      (payload: DeviceDataPayload) => {
        if (payload.deviceId !== deviceId) {
          return;
        }
        const value = payload.tagValues[tagId];
        if (value) {
          setTagValue(tagId, value);
        }
      },
    );

    invoke("SubscribeDevice", deviceId).catch(() => undefined);

    return () => {
      unsubscribe();
      invoke("UnsubscribeDevice", deviceId).catch(() => undefined);
    };
  }, [deviceId, tagId, invoke, setTagValue, subscribe]);
};

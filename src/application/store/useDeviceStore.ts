import { create } from "zustand";
import type { Device } from "@core/domain/entities";
import type { DeviceStatusPayload } from "@shared/types";

/** Device list state and selection tracking. */
export interface DeviceState {
  devices: Device[];
  deviceStatusMap: Record<string, DeviceStatusPayload>;
  selectedDeviceId: string | null;
  isLoading: boolean;
  error: string | null;
  setDevices: (devices: Device[]) => void;
  setDeviceStatus: (deviceId: string, status: DeviceStatusPayload) => void;
  setSelectedDeviceId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearDeviceStatus: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  deviceStatusMap: {},
  selectedDeviceId: null,
  isLoading: false,
  error: null,
  setDevices: (devices) => set({ devices }),
  setDeviceStatus: (deviceId, status) =>
    set((state) => ({
      deviceStatusMap: { ...state.deviceStatusMap, [deviceId]: status },
    })),
  setSelectedDeviceId: (selectedDeviceId) => set({ selectedDeviceId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearDeviceStatus: () => set({ deviceStatusMap: {} }),
}));

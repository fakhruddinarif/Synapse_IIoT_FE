import type { Device } from "./Device";

/** Storage flow device join entity. */
export interface StorageFlowDevice {
  id: string;
  storageFlowId: string;
  deviceId: string;
  createdAt: string;
  device?: Device;
}

import type { Device } from "../domain/entities";

/** Repository contract for device operations. */
export interface IDeviceRepository {
  getDevices(): Promise<Device[]>;
  getDeviceById(id: string): Promise<Device | null>;
}

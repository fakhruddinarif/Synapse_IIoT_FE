import type { Device } from "@core/domain/entities";
import type { IDeviceRepository } from "@core/repositories";
import { apiClient } from "@infra/api/http/apiClient";
import { ENDPOINTS } from "@infra/api/http/endpoints";

/** HTTP-backed device repository implementation. */
export class DeviceRepositoryImpl implements IDeviceRepository {
  async getDevices(): Promise<Device[]> {
    return apiClient.get<Device[]>(ENDPOINTS.DEVICES);
  }

  async getDeviceById(id: string): Promise<Device | null> {
    return apiClient.get<Device>(ENDPOINTS.DEVICE_BY_ID(id));
  }
}

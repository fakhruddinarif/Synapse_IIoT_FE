import type { IDeviceRepository } from "../../repositories";
import type { Device } from "../../domain/entities";

/** Retrieves the full device list. */
export class GetDevicesUseCase {
  constructor(private readonly repository: IDeviceRepository) {}

  async execute(): Promise<Device[]> {
    return this.repository.getDevices();
  }
}

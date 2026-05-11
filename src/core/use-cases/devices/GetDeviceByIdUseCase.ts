import type { IDeviceRepository } from "../../repositories";
import type { Device } from "../../domain/entities";

/** Retrieves a single device by id. */
export class GetDeviceByIdUseCase {
  constructor(private readonly repository: IDeviceRepository) {}

  async execute(id: string): Promise<Device | null> {
    return this.repository.getDeviceById(id);
  }
}

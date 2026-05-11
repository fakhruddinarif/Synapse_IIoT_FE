import type { ITagRepository } from "../../repositories";
import type { Tag } from "../../domain/entities";

/** Retrieves tags for a given device. */
export class GetTagsByDeviceUseCase {
  constructor(private readonly repository: ITagRepository) {}

  async execute(deviceId: string): Promise<Tag[]> {
    return this.repository.getTagsByDevice(deviceId);
  }
}

import type { Tag } from "@core/domain/entities";
import type { ITagRepository } from "@core/repositories";
import { apiClient } from "@infra/api/http/apiClient";
import { ENDPOINTS } from "@infra/api/http/endpoints";

/** HTTP-backed tag repository implementation. */
export class TagRepositoryImpl implements ITagRepository {
  async getTags(): Promise<Tag[]> {
    return apiClient.get<Tag[]>(ENDPOINTS.TAGS);
  }

  async getTagsByDevice(deviceId: string): Promise<Tag[]> {
    return apiClient.get<Tag[]>(ENDPOINTS.TAGS_BY_DEVICE(deviceId));
  }

  async getTagById(tagId: string): Promise<Tag | null> {
    return apiClient.get<Tag>(ENDPOINTS.TAG_BY_ID(tagId));
  }
}

import type { Tag } from "@core/domain/entities";
import type {
  ApiResponse,
  CreateTagRequest,
  UpdateTagRequest,
} from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** Tag HTTP API helpers. */
export const tagApi = {
  async list(): Promise<Tag[]> {
    const response = await apiClient.get<ApiResponse<Tag[]>>(ENDPOINTS.TAGS);
    return response.data;
  },
  async getById(id: string): Promise<Tag> {
    const response = await apiClient.get<ApiResponse<Tag>>(
      ENDPOINTS.TAG_BY_ID(id),
    );
    return response.data;
  },
  async listByDevice(deviceId: string): Promise<Tag[]> {
    const response = await apiClient.get<ApiResponse<Tag[]>>(
      ENDPOINTS.TAGS_BY_DEVICE(deviceId),
    );
    return response.data;
  },
  async create(payload: CreateTagRequest): Promise<Tag> {
    const response = await apiClient.post<ApiResponse<Tag>, CreateTagRequest>(
      ENDPOINTS.TAGS,
      payload,
    );
    return response.data;
  },
  async update(id: string, payload: UpdateTagRequest): Promise<Tag> {
    const response = await apiClient.put<ApiResponse<Tag>, UpdateTagRequest>(
      ENDPOINTS.TAG_BY_ID(id),
      payload,
    );
    return response.data;
  },
};

import type { StorageFlow } from "@core/domain/entities";
import type {
  ApiResponse,
  CreateStorageFlowRequest,
  DiscoverFieldsResponse,
  StorageFlowListResponse,
} from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** Storage flow HTTP API helpers. */
export const storageFlowApi = {
  async list(): Promise<StorageFlowListResponse> {
    return apiClient
      .get<ApiResponse<StorageFlowListResponse>>(ENDPOINTS.STORAGE_FLOWS)
      .then((r) => r.data);
  },
  async getById(id: string): Promise<StorageFlow> {
    const response = await apiClient.get<ApiResponse<StorageFlow>>(
      ENDPOINTS.STORAGE_FLOW_BY_ID(id),
    );
    return response.data;
  },
  async create(payload: CreateStorageFlowRequest): Promise<StorageFlow> {
    const response = await apiClient.post<
      ApiResponse<StorageFlow>,
      CreateStorageFlowRequest
    >(ENDPOINTS.STORAGE_FLOWS, payload);
    return response.data;
  },
  async discoverFields(payload: {
    masterTableId: string;
  }): Promise<DiscoverFieldsResponse> {
    const response = await apiClient.post<
      ApiResponse<DiscoverFieldsResponse>,
      { masterTableId: string }
    >(ENDPOINTS.STORAGE_FLOW_DISCOVER, payload);
    return response.data;
  },
};

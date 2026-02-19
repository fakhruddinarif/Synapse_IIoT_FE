import { fetchApi } from "~/lib/api";
import type {
  StorageFlow,
  CreateStorageFlowDto,
  UpdateStorageFlowDto,
  StorageFlowFilterDto,
  ApiResponse,
} from "~/types/storage-flow";

export const storageFlowService = {
  async getAll(
    filter?: StorageFlowFilterDto,
  ): Promise<ApiResponse<StorageFlow[]>> {
    const params = new URLSearchParams();
    if (filter?.deviceId) params.append("deviceId", filter.deviceId);
    if (filter?.masterTableId)
      params.append("masterTableId", filter.masterTableId);
    if (filter?.search) params.append("search", filter.search);
    if (filter?.isActive !== undefined)
      params.append("isActive", filter.isActive.toString());
    if (filter?.page) params.append("page", filter.page.toString());
    if (filter?.pageSize) params.append("pageSize", filter.pageSize.toString());

    return fetchApi<ApiResponse<StorageFlow[]>>(
      `/storage-flow?${params.toString()}`,
    );
  },

  async getById(id: string): Promise<ApiResponse<StorageFlow>> {
    return fetchApi<ApiResponse<StorageFlow>>(`/storage-flow/${id}`);
  },

  async create(data: CreateStorageFlowDto): Promise<ApiResponse<StorageFlow>> {
    return fetchApi<ApiResponse<StorageFlow>>("/storage-flow", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: UpdateStorageFlowDto,
  ): Promise<ApiResponse<StorageFlow>> {
    return fetchApi<ApiResponse<StorageFlow>>(`/storage-flow/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`/storage-flow/${id}`, {
      method: "DELETE",
    });
  },
};

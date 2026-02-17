import { fetchApi } from "~/lib/api";
import type {
  Device,
  CreateDeviceDto,
  UpdateDeviceDto,
  DeviceFilterDto,
  ApiResponse,
} from "~/types/device";

export const deviceService = {
  async getAll(filter: DeviceFilterDto): Promise<ApiResponse<Device[]>> {
    const params = new URLSearchParams();
    if (filter.name) params.append("name", filter.name);
    if (filter.description) params.append("description", filter.description);
    if (filter.protocol !== undefined)
      params.append("protocol", filter.protocol.toString());
    if (filter.search) params.append("search", filter.search);
    if (filter.isEnabled !== undefined)
      params.append("isEnabled", filter.isEnabled.toString());
    if (filter.page) params.append("page", filter.page.toString());
    if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());

    return fetchApi<ApiResponse<Device[]>>(`/device?${params.toString()}`);
  },

  async getById(id: string): Promise<ApiResponse<Device>> {
    return fetchApi<ApiResponse<Device>>(`/device/${id}`);
  },

  async create(data: CreateDeviceDto): Promise<ApiResponse<Device>> {
    return fetchApi<ApiResponse<Device>>("/device", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: UpdateDeviceDto,
  ): Promise<ApiResponse<Device>> {
    return fetchApi<ApiResponse<Device>>(`/device/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`/device/${id}`, {
      method: "DELETE",
    });
  },
};

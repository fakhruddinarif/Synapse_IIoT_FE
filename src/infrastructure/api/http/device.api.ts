import type { Device } from "@core/domain/entities";
import type {
  ApiResponse,
  CreateDeviceRequest,
  TestHttpConnectionRequest,
  UpdateDeviceRequest,
} from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** Device HTTP API helpers. */
export const deviceApi = {
  async list(): Promise<Device[]> {
    const response = await apiClient.get<ApiResponse<Device[]>>(
      ENDPOINTS.DEVICES,
    );
    return response.data;
  },
  async getById(id: string): Promise<Device> {
    const response = await apiClient.get<ApiResponse<Device>>(
      ENDPOINTS.DEVICE_BY_ID(id),
    );
    return response.data;
  },
  async create(payload: CreateDeviceRequest): Promise<Device> {
    const response = await apiClient.post<
      ApiResponse<Device>,
      CreateDeviceRequest
    >(ENDPOINTS.DEVICES, payload);
    return response.data;
  },
  async update(id: string, payload: UpdateDeviceRequest): Promise<Device> {
    const response = await apiClient.put<
      ApiResponse<Device>,
      UpdateDeviceRequest
    >(ENDPOINTS.DEVICE_BY_ID(id), payload);
    return response.data;
  },
  async testHttpConnection(payload: TestHttpConnectionRequest): Promise<void> {
    await apiClient.post<ApiResponse<unknown>, TestHttpConnectionRequest>(
      ENDPOINTS.DEVICE_TEST_CONN,
      payload,
    );
  },
};

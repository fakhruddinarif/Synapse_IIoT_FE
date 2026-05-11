import type {
  FileConfigResponse,
  FileUploadResponse,
  ApiResponse,
} from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** File HTTP API helpers. */
export const fileApi = {
  async getConfig(): Promise<FileConfigResponse> {
    const response = await apiClient.get<ApiResponse<FileConfigResponse>>(
      ENDPOINTS.FILE_CONFIG,
    );
    return response.data;
  },
  async upload(formData: FormData): Promise<FileUploadResponse> {
    const response = await apiClient.post<
      ApiResponse<FileUploadResponse>,
      FormData
    >(ENDPOINTS.FILE_UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

import type { MasterTable, MasterTableField } from "@core/domain/entities";
import type {
  ApiResponse,
  CreateMasterTableFieldRequest,
  CreateMasterTableRequest,
  MasterTableListResponse,
} from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** Master table HTTP API helpers. */
export const masterTableApi = {
  async list(): Promise<MasterTableListResponse> {
    return apiClient
      .get<ApiResponse<MasterTableListResponse>>(ENDPOINTS.MASTER_TABLES)
      .then((r) => r.data);
  },
  async getById(id: string): Promise<MasterTable> {
    const response = await apiClient.get<ApiResponse<MasterTable>>(
      ENDPOINTS.MASTER_TABLE_BY_ID(id),
    );
    return response.data;
  },
  async create(payload: CreateMasterTableRequest): Promise<MasterTable> {
    const response = await apiClient.post<
      ApiResponse<MasterTable>,
      CreateMasterTableRequest
    >(ENDPOINTS.MASTER_TABLES, payload);
    return response.data;
  },
  async createField(
    masterTableId: string,
    payload: CreateMasterTableFieldRequest,
  ): Promise<MasterTableField> {
    const response = await apiClient.post<
      ApiResponse<MasterTableField>,
      CreateMasterTableFieldRequest
    >(ENDPOINTS.MASTER_TABLE_FIELDS(masterTableId), payload);
    return response.data;
  },
};

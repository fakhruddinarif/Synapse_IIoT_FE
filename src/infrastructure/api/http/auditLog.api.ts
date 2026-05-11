import type { AuditLogListResponse, ApiResponse } from "@shared/types";
import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/** Audit log HTTP API helpers. */
export const auditLogApi = {
  async list(): Promise<AuditLogListResponse> {
    const response = await apiClient.get<ApiResponse<AuditLogListResponse>>(
      ENDPOINTS.AUDIT_LOGS,
    );
    return response.data;
  },
};

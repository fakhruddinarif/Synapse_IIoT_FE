import { fetchApi } from "~/lib/api";
import type {
  MasterTable,
  CreateMasterTableDto,
  UpdateMasterTableDto,
  MasterTableFilterDto,
  ApiResponse,
  MasterTableField,
  CreateMasterTableField,
  UpdateMasterTableFieldDto,
} from "~/types/master-table";

export const masterTableService = {
  async getAll(
    filter?: MasterTableFilterDto,
  ): Promise<ApiResponse<MasterTable[]>> {
    const params = new URLSearchParams();
    if (filter?.search) params.append("search", filter.search);
    if (filter?.page) params.append("page", filter.page.toString());
    if (filter?.pageSize) params.append("pageSize", filter.pageSize.toString());

    return fetchApi<ApiResponse<MasterTable[]>>(
      `/master-tables?${params.toString()}`,
    );
  },

  async getById(id: string): Promise<ApiResponse<MasterTable>> {
    return fetchApi<ApiResponse<MasterTable>>(`/master-tables/${id}`);
  },

  async create(data: CreateMasterTableDto): Promise<ApiResponse<MasterTable>> {
    return fetchApi<ApiResponse<MasterTable>>("/master-tables", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: UpdateMasterTableDto,
  ): Promise<ApiResponse<MasterTable>> {
    return fetchApi<ApiResponse<MasterTable>>(`/master-tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`/master-tables/${id}`, {
      method: "DELETE",
    });
  },

  // Field management
  async getFields(
    masterTableId: string,
  ): Promise<ApiResponse<MasterTableField[]>> {
    return fetchApi<ApiResponse<MasterTableField[]>>(
      `/master-tables/${masterTableId}/fields`,
    );
  },

  async createField(
    masterTableId: string,
    data: CreateMasterTableField,
  ): Promise<ApiResponse<MasterTableField>> {
    return fetchApi<ApiResponse<MasterTableField>>(
      `/master-tables/${masterTableId}/fields`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  async updateField(
    masterTableId: string,
    fieldId: string,
    data: UpdateMasterTableFieldDto,
  ): Promise<ApiResponse<MasterTableField>> {
    return fetchApi<ApiResponse<MasterTableField>>(
      `/master-tables/${masterTableId}/fields/${fieldId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  },

  async deleteField(
    masterTableId: string,
    fieldId: string,
  ): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(
      `/master-tables/${masterTableId}/fields/${fieldId}`,
      {
        method: "DELETE",
      },
    );
  },
};

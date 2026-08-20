import type {
  ApiEnvelope,
  DataTypeTable,
  MasterTableDto,
  MasterTableFieldDto,
} from "../@types/synapse";
import { deleteJson, getJson, postJson, putJson, unwrapResponse } from "./http";

export type CreateMasterTableFieldDto = {
  name: string;
  dataType: DataTypeTable;
  isEnabled: boolean;
};

export type CreateMasterTableDto = {
  name: string;
  tableName: string;
  description?: string;
  isActive: boolean;
  fields: CreateMasterTableFieldDto[];
};

export type UpdateMasterTableDto = Partial<
  Omit<CreateMasterTableDto, "fields">
>;
export type UpdateMasterTableFieldDto = Partial<CreateMasterTableFieldDto>;

export const listMasterTables = async () => {
  const response =
    await getJson<ApiEnvelope<MasterTableDto[]>>("/api/master-tables");
  return response;
};

export const getMasterTable = async (id: string) => {
  const response = await getJson<ApiEnvelope<MasterTableDto>>(
    `/api/master-tables/${id}`,
  );
  return unwrapResponse(response);
};

export const createMasterTable = async (dto: CreateMasterTableDto) => {
  const response = await postJson<ApiEnvelope<MasterTableDto>>(
    "/api/master-tables",
    dto,
  );
  return unwrapResponse(response);
};

export const updateMasterTable = async (
  id: string,
  dto: UpdateMasterTableDto,
) => {
  const response = await putJson<ApiEnvelope<MasterTableDto>>(
    `/api/master-tables/${id}`,
    dto,
  );
  return unwrapResponse(response);
};

export const deleteMasterTable = async (id: string) => {
  await deleteJson<ApiEnvelope<null>>(`/api/master-tables/${id}`);
};

export const getMasterTableFields = async (masterTableId: string) => {
  const response = await getJson<ApiEnvelope<MasterTableFieldDto[]>>(
    `/api/master-tables/${masterTableId}/fields`,
  );
  return response;
};

export const createMasterTableField = async (
  masterTableId: string,
  dto: CreateMasterTableFieldDto,
) => {
  const response = await postJson<ApiEnvelope<MasterTableFieldDto>>(
    `/api/master-tables/${masterTableId}/fields`,
    dto,
  );
  return unwrapResponse(response);
};

export const updateMasterTableField = async (
  masterTableId: string,
  fieldId: string,
  dto: UpdateMasterTableFieldDto,
) => {
  const response = await putJson<ApiEnvelope<MasterTableFieldDto>>(
    `/api/master-tables/${masterTableId}/fields/${fieldId}`,
    dto,
  );
  return unwrapResponse(response);
};

export const deleteMasterTableField = async (
  masterTableId: string,
  fieldId: string,
) => {
  await deleteJson<ApiEnvelope<null>>(
    `/api/master-tables/${masterTableId}/fields/${fieldId}`,
  );
};

import type {
  ApiEnvelope,
  DiscoveredFieldDto,
  StorageFlowDto,
} from "../@types/synapse";
import { deleteJson, getJson, postJson, putJson, unwrapResponse } from "./http";

export type CreateStorageFlowMappingDto = {
  masterTableFieldId: string;
  sourcePath: string;
  tagId?: string | null;
};

export type CreateStorageFlowDto = {
  name: string;
  description?: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  deviceIds: string[];
  mappings: CreateStorageFlowMappingDto[];
};

export type UpdateStorageFlowDto = Partial<CreateStorageFlowDto>;

export const listStorageFlows = async () => {
  const response =
    await getJson<ApiEnvelope<StorageFlowDto[]>>("/api/storage-flow");
  return response;
};

export const getStorageFlow = async (id: string) => {
  const response = await getJson<ApiEnvelope<StorageFlowDto>>(
    `/api/storage-flow/${id}`,
  );
  return unwrapResponse(response);
};

export const createStorageFlow = async (dto: CreateStorageFlowDto) => {
  const response = await postJson<ApiEnvelope<StorageFlowDto>>(
    "/api/storage-flow",
    dto,
  );
  return unwrapResponse(response);
};

export const updateStorageFlow = async (
  id: string,
  dto: UpdateStorageFlowDto,
) => {
  const response = await putJson<ApiEnvelope<StorageFlowDto>>(
    `/api/storage-flow/${id}`,
    dto,
  );
  return unwrapResponse(response);
};

export const deleteStorageFlow = async (id: string) => {
  await deleteJson<ApiEnvelope<null>>(`/api/storage-flow/${id}`);
};

export const discoverFields = async (deviceId: string) => {
  const response = await postJson<ApiEnvelope<DiscoveredFieldDto[]>>(
    "/api/storage-flow/discover-fields",
    {
      deviceId,
    },
  );

  return response;
};

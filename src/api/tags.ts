import type {
  AccessMode,
  ApiEnvelope,
  DataType,
  TagResponseDto,
} from "../@types/synapse";
import { deleteJson, getJson, postJson, putJson, unwrapResponse } from "./http";

export type TagFilter = {
  deviceId?: string;
  searchTerm?: string;
  dataType?: DataType | "";
  page?: number;
  pageSize?: number;
};

export type CreateTagDto = {
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: AccessMode;
  rawMin: number;
  rawMax: number;
  euMin: number;
  euMax: number;
  unit?: string | null;
  opcUaNodeId?: string | null;
};

export type UpdateTagDto = Partial<CreateTagDto>;

export const listTags = async (filter: TagFilter = {}) => {
  const response = await getJson<ApiEnvelope<TagResponseDto[]>>("/api/tags", {
    query: filter as Record<
      string,
      string | number | boolean | null | undefined
    >,
  });

  return response;
};

export const getTag = async (id: string) => {
  const response = await getJson<TagResponseDto | ApiEnvelope<TagResponseDto>>(
    `/api/tags/${id}`,
  );
  return unwrapResponse(response as ApiEnvelope<TagResponseDto>);
};

export const listTagsByDevice = async (deviceId: string) => {
  const response = await getJson<ApiEnvelope<TagResponseDto[]>>(
    `/api/tags/device/${deviceId}`,
  );
  return response;
};

export const createTag = async (dto: CreateTagDto) => {
  const response = await postJson<ApiEnvelope<TagResponseDto>>(
    "/api/tags",
    dto,
  );
  return unwrapResponse(response);
};

export const updateTag = async (id: string, dto: UpdateTagDto) => {
  const response = await putJson<ApiEnvelope<TagResponseDto>>(
    `/api/tags/${id}`,
    dto,
  );
  return unwrapResponse(response);
};

export const deleteTag = async (id: string) => {
  await deleteJson<ApiEnvelope<null>>(`/api/tags/${id}`);
};

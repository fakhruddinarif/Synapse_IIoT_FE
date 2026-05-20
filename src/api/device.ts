import type {
  ApiEnvelope,
  DeviceResponseDto,
  Protocol,
} from "../@types/synapse";
import { deleteJson, getJson, postJson, putJson, unwrapResponse } from "./http";

export type DeviceFilter = {
  name?: string;
  description?: string;
  protocol?: Protocol | "";
  search?: string;
  isEnabled?: boolean | "";
  page?: number;
  pageSize?: number;
};

export type CreateDeviceDto = {
  name: string;
  description?: string;
  isEnabled: boolean;
  protocol: Protocol;
  connectionConfig: Record<string, unknown>;
  pollingInterval: number;
};

export type UpdateDeviceDto = Partial<CreateDeviceDto>;

export type TestHttpConnectionDto = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

export const listDevices = async (filter: DeviceFilter = {}) => {
  const response = await getJson<ApiEnvelope<DeviceResponseDto[]>>(
    "/api/device",
    {
      query: filter as Record<
        string,
        string | number | boolean | null | undefined
      >,
    },
  );

  return response;
};

export const getDevice = async (id: string) => {
  const response = await getJson<ApiEnvelope<DeviceResponseDto>>(
    `/api/device/${id}`,
  );
  return unwrapResponse(response);
};

export const createDevice = async (dto: CreateDeviceDto) => {
  const response = await postJson<ApiEnvelope<DeviceResponseDto>>(
    "/api/device",
    dto,
  );
  return unwrapResponse(response);
};

export const updateDevice = async (id: string, dto: UpdateDeviceDto) => {
  const response = await putJson<ApiEnvelope<DeviceResponseDto>>(
    `/api/device/${id}`,
    dto,
  );
  return unwrapResponse(response);
};

export const deleteDevice = async (id: string) => {
  await deleteJson<ApiEnvelope<null>>(`/api/device/${id}`);
};

export const testHttpDeviceConnection = async (dto: TestHttpConnectionDto) => {
  const response = await postJson<ApiEnvelope<unknown>>(
    "/api/device/test-http-connection",
    dto,
  );
  return response;
};

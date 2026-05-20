import type { ApiEnvelope, UserInfoDto } from "../@types/synapse";
import { getJson, postJson, unwrapResponse } from "./http";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export const login = async (dto: LoginDto) => {
  const response = await postJson<ApiEnvelope<UserInfoDto>>(
    "/api/auth/login",
    dto,
  );
  return unwrapResponse(response);
};

export const register = async (dto: RegisterDto) => {
  const response = await postJson<ApiEnvelope<UserInfoDto>>(
    "/api/auth/register",
    dto,
  );
  return unwrapResponse(response);
};

export const getCurrentUser = async () => {
  const response = await getJson<ApiEnvelope<UserInfoDto>>("/api/auth/info");
  return unwrapResponse(response);
};

export const logout = async () => {
  await postJson<ApiEnvelope<null>>("/api/auth/logout");
};

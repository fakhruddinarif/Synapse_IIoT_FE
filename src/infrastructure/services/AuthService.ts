import type { User } from "@core/domain/entities";
import type {
  ApiResponse,
  AuthInfoResponse,
  LoginRequest,
} from "@shared/types";
import { apiClient } from "@infra/api/http/apiClient";
import { ENDPOINTS } from "@infra/api/http/endpoints";

/** Handles backend authentication calls. */
export const AuthService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await apiClient.post<
      ApiResponse<AuthInfoResponse>,
      LoginRequest
    >(ENDPOINTS.AUTH_LOGIN, credentials);
    return response.data.user;
  },
  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH_LOGOUT);
  },
  async fetchUserInfo(): Promise<User> {
    const response = await apiClient.get<ApiResponse<AuthInfoResponse>>(
      ENDPOINTS.AUTH_INFO,
    );
    return response.data.user;
  },
};

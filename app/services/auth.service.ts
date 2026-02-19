import { fetchApi } from "~/lib/api";
import { z } from "zod";

// Validation Schemas
export const LoginRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  role: z.enum(["ADMIN", "OPERATOR", "VIEWER"]).optional(),
});

// User types
export enum UserRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role?: UserRole;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  error?: string[];
}

export interface CsrfTokenData {
  csrf_token: string;
}

// Utility functions for user permissions
export const userHelpers = {
  isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  },

  isOperator(user: User): boolean {
    return user.role === UserRole.OPERATOR;
  },

  isViewer(user: User): boolean {
    return user.role === UserRole.VIEWER;
  },

  canWrite(user: User): boolean {
    return user.role === UserRole.ADMIN || user.role === UserRole.OPERATOR;
  },

  canDelete(user: User): boolean {
    return user.role === UserRole.ADMIN;
  },
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return fetchApi<ApiResponse<User>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    // CSRF Token temporarily disabled
    // Get CSRF token first
    // const csrfResponse = await this.getCsrfToken();
    // const csrfToken = csrfResponse.data.csrf_token;

    return fetchApi<ApiResponse<User>>("/auth/register", {
      method: "POST",
      // headers: {
      //   "X-CSRF-TOKEN": csrfToken,
      // },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        role: data.role || UserRole.VIEWER,
      }),
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return fetchApi<ApiResponse<User>>("/auth/info");
  },

  async logout(): Promise<void> {
    await fetchApi("/auth/logout", {
      method: "POST",
    });
  },

  async getCsrfToken(): Promise<ApiResponse<CsrfTokenData>> {
    return fetchApi<ApiResponse<CsrfTokenData>>("/csrf-token");
  },
};

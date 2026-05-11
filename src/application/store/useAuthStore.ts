import { create } from "zustand";
import type { User } from "@core/domain/entities";
import type { LoginRequest } from "@shared/types";
import { getPermissionsForRole, type Permission } from "@shared/constants";
import { AuthService } from "@infra/services/AuthService";
import { setAuthUnauthorizedHandler } from "@infra/services/authEvents";

/** Authentication state driven by backend cookie auth. */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  permissions: [],
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await AuthService.login(credentials);
      set({
        user,
        isAuthenticated: true,
        permissions: getPermissionsForRole(user.role),
        isLoading: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        permissions: [],
        isLoading: false,
      });
    }
  },
  fetchUserInfo: async () => {
    set({ isLoading: true });
    try {
      const user = await AuthService.fetchUserInfo();
      set({
        user,
        isAuthenticated: true,
        permissions: getPermissionsForRole(user.role),
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        permissions: [],
        isLoading: false,
      });
    }
  },
  clearSession: () =>
    set({ user: null, isAuthenticated: false, permissions: [] }),
}));

setAuthUnauthorizedHandler(() => {
  useAuthStore.getState().clearSession();
});

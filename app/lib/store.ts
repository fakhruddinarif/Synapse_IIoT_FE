import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * ==================== TYPES ====================
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "OPERATOR" | "VIEWER";
}

export interface Device {
  id: string;
  name: string;
  description?: string;
  protocol: "MODBUS_TCP" | "MODBUS_RTU" | "MQTT" | "OPC_UA" | "HTTP";
  isEnabled: boolean;
  isOnline: boolean;
  lastErrorMessage?: string | null;
  lastSuccessfulReadAt?: string | null;
  pollingInterval: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Tag {
  id: string;
  deviceId: string;
  name: string;
  address: string;
  dataType: "INT16" | "INT32" | "FLOAT" | "DOUBLE" | "BOOL" | "STRING";
  scalingRawMin: number;
  scalingRawMax: number;
  scalingEngMin: number;
  scalingEngMax: number;
  unit?: string;
  currentRawValue?: number;
  currentEngValue?: number;
  valueUpdatedAt?: string;
  createdAt: string;
}

export interface TagData {
  tagId: string;
  tagName: string;
  deviceId: string;
  currentEngValue: number;
  currentRawValue: number;
  unit?: string;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

/**
 * ==================== AUTH STORE ====================
 */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  clearError: () => set({ error: null }),
}));

/**
 * ==================== DEVICE STORE ====================
 */

interface DeviceState {
  devices: Device[];
  selectedDeviceId: string | null;
  isLoading: boolean;
  error: string | null;

  setDevices: (devices: Device[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  updateDeviceStatus: (deviceId: string, isOnline: boolean) => void;
  clearError: () => void;
}

export type { DeviceState };

export const useDeviceStore = create<DeviceState>(
  subscribeWithSelector(
    (set: any) =>
      ({
        devices: [],
        selectedDeviceId: null,
        isLoading: false,
        error: null,

        setDevices: (devices: Device[]) => set({ devices, error: null }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),
        setSelectedDevice: (deviceId: string | null) =>
          set({ selectedDeviceId: deviceId }),
        updateDeviceStatus: (deviceId: string, isOnline: boolean) =>
          set((state: DeviceState) => ({
            devices: state.devices.map((d: Device) =>
              d.id === deviceId ? { ...d, isOnline } : d,
            ),
          })),
        clearError: () => set({ error: null }),
      }) as const,
  ) as any,
) as any;

/**
 * ==================== TAG STORE ====================
 */

interface TagState {
  tags: Tag[];
  tagDataMap: Map<string, TagData>;
  isLoading: boolean;
  error: string | null;

  setTags: (tags: Tag[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateTagData: (tagId: string, data: Partial<TagData>) => void;
  getTagData: (tagId: string) => TagData | undefined;
  clearAllTags: () => void;
  clearError: () => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  tagDataMap: new Map(),
  isLoading: false,
  error: null,

  setTags: (tags) => set({ tags, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  updateTagData: (tagId: string, data: Partial<TagData>) => {
    set((state) => {
      const newMap = new Map(state.tagDataMap);
      const existing = newMap.get(tagId);
      newMap.set(tagId, { ...existing, ...data } as TagData);
      return { tagDataMap: newMap };
    });
  },

  getTagData: (tagId: string) => get().tagDataMap.get(tagId),

  clearAllTags: () => set({ tagDataMap: new Map(), tags: [] }),

  clearError: () => set({ error: null }),
}));

/**
 * ==================== THEME STORE ====================
 */

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Initialize from localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = globalThis.matchMedia
    ? globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
  const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;

  return {
    isDark: initialDark,

    toggleTheme: () =>
      set((state) => {
        const newDark = !state.isDark;
        localStorage.setItem("theme", newDark ? "dark" : "light");
        if (newDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return { isDark: newDark };
      }),

    setTheme: (isDark) => {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      set({ isDark });
    },
  };
});

/**
 * ==================== UI STATE STORE ====================
 */

interface UIState {
  sidebarOpen: boolean;
  toastMessage: string | null;
  toastType: "success" | "error" | "warning" | "info";

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toastMessage: null,
  toastType: "info",

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  showToast: (message, type = "info") =>
    set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null }),
}));

/**
 * ==================== REAL-TIME STORE ====================
 */

interface RealtimeState {
  isConnected: boolean;
  isConnecting: boolean;
  lastUpdate: Date | null;

  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setLastUpdate: (date: Date) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: false,
  isConnecting: false,
  lastUpdate: null,

  setConnected: (connected) => set({ isConnected: connected }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
}));

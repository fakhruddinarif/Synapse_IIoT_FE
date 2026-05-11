import axios from "axios";
import { toast } from "sonner";
import { handleUnauthorized } from "@infra/services/authEvents";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5009/api";
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);

export const axiosInstance = axios.create({
  baseURL,
  timeout,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;

    if (status === 401) {
      handleUnauthorized();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    if (status === 429) {
      const retryAfter = error?.response?.headers?.["retry-after"];
      const isLogin = error?.config?.url?.includes("/auth/login");
      toast.error(isLogin ? "Too many login attempts" : "Too many requests", {
        description: retryAfter
          ? `Retry after ${retryAfter}s`
          : "Please wait and try again.",
      });
    }

    return Promise.reject(error);
  },
);

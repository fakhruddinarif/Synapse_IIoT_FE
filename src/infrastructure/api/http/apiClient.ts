import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";

/** Typed HTTP client helpers built on Axios. */
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },
  post: async <T, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => {
    const response = await axiosInstance.post<T>(url, body, config);
    return response.data;
  },
  put: async <T, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => {
    const response = await axiosInstance.put<T>(url, body, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

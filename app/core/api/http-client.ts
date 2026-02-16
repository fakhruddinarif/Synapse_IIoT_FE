import { ApiError, NetworkError } from "../errors/api-error";

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface IHttpClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}

export class HttpClient implements IHttpClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, config);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...config?.headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw ApiError.fromResponse(responseData);
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new NetworkError("Failed to connect to the server");
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  }
}

// Factory function to create HTTP client instance
export const createHttpClient = (config: HttpClientConfig): IHttpClient => {
  return new HttpClient(config);
};

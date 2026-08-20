import type { ApiEnvelope } from "../@types/synapse";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestOptions = {
  method?: RequestMethod;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
};

const parseResponseBody = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

export function unwrapResponse<T>(
  payload: ApiEnvelope<T> | T | null | undefined,
): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload as T;
}

const serializeBody = (body: unknown) => {
  if (body === undefined) {
    return undefined;
  }

  if (isFormData(body) || body instanceof Blob || typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
};

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {};

  if (options.body && !isFormData(options.body)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    credentials: "include",
    headers,
    body: serializeBody(options.body),
    signal: options.signal,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(
            (payload as { message?: string }).message ?? response.statusText,
          )
        : response.statusText || "Request failed";

    const error = new Error(message);
    (error as Error & { status?: number; payload?: unknown }).status =
      response.status;
    (error as Error & { status?: number; payload?: unknown }).payload = payload;
    throw error;
  }

  return payload as T;
}

export const getJson = <T>(
  path: string,
  options: Omit<RequestOptions, "method" | "body"> = {},
) => request<T>(path, { ...options, method: "GET" });

export const postJson = <T>(
  path: string,
  body?: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {},
) => request<T>(path, { ...options, method: "POST", body });

export const putJson = <T>(
  path: string,
  body?: unknown,
  options: Omit<RequestOptions, "method" | "body"> = {},
) => request<T>(path, { ...options, method: "PUT", body });

export const deleteJson = <T>(
  path: string,
  options: Omit<RequestOptions, "method" | "body"> = {},
) => request<T>(path, { ...options, method: "DELETE" });

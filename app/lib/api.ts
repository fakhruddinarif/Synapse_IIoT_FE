const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));

    // Throw custom error with status code information
    throw new ApiError(
      error.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.statusText,
    );
  }

  return response.json();
}

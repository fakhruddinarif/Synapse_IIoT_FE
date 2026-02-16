import { createHttpClient } from "~/core/api/http-client";
import { AuthApiDataSource } from "~/data/datasources/auth.datasource";
import { AuthRepository } from "~/data/repositories/auth.repository.impl";

// Get API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5009";

// Create HTTP client instance
const httpClient = createHttpClient({
  baseURL: API_BASE_URL,
});

// Create data source instance
const authDataSource = new AuthApiDataSource(httpClient);

// Create and export repository instance
export const authRepository = new AuthRepository(authDataSource);

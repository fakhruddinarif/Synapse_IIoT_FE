import type { IHttpClient } from "~/core/api/http-client";
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  UserResponseSchema,
  CsrfTokenResponseSchema,
  type LoginRequest,
  type RegisterRequest,
  type UserDto,
} from "../schemas/auth.schema";

export interface IAuthDataSource {
  login(credentials: LoginRequest): Promise<UserDto>;
  register(data: RegisterRequest): Promise<UserDto>;
  getCurrentUser(): Promise<UserDto>;
  logout(): Promise<void>;
  getCsrfToken(): Promise<string>;
}

export class AuthApiDataSource implements IAuthDataSource {
  constructor(private readonly httpClient: IHttpClient) {}

  async login(credentials: LoginRequest): Promise<UserDto> {
    // Validate input
    const validatedData = LoginRequestSchema.parse(credentials);

    // Make API request
    const response = await this.httpClient.post(
      "/api/auth/login",
      validatedData,
    );

    // Validate response
    const validatedResponse = UserResponseSchema.parse(response);

    return validatedResponse.data;
  }

  async register(data: RegisterRequest): Promise<UserDto> {
    // Validate input
    const validatedData = RegisterRequestSchema.parse(data);

    // Get CSRF token first
    const csrfToken = await this.getCsrfToken();

    // Make API request with CSRF token
    const response = await this.httpClient.post(
      "/api/auth/register",
      validatedData,
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      },
    );

    // Validate response
    const validatedResponse = UserResponseSchema.parse(response);

    return validatedResponse.data;
  }

  async getCurrentUser(): Promise<UserDto> {
    const response = await this.httpClient.get("/api/auth/info");

    // Validate response
    const validatedResponse = UserResponseSchema.parse(response);

    return validatedResponse.data;
  }

  async logout(): Promise<void> {
    await this.httpClient.post("/api/auth/logout");
  }

  async getCsrfToken(): Promise<string> {
    const response = await this.httpClient.get("/api/csrf-token");

    // Validate response
    const validatedResponse = CsrfTokenResponseSchema.parse(response);

    return validatedResponse.data.csrf_token;
  }
}

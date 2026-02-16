import type { UserEntity } from "../entities/user.entity";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role?: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<UserEntity>;
  register(data: RegisterData): Promise<UserEntity>;
  getCurrentUser(): Promise<UserEntity>;
  logout(): Promise<void>;
  getCsrfToken(): Promise<string>;
}

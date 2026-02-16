import type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
} from "~/domain/repositories/auth.repository";
import type { UserEntity } from "~/domain/entities/user.entity";
import type { IAuthDataSource } from "../datasources/auth.datasource";
import { UserMapper } from "../mappers/user.mapper";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly dataSource: IAuthDataSource) {}

  async login(credentials: LoginCredentials): Promise<UserEntity> {
    const userDto = await this.dataSource.login(credentials);
    return UserMapper.toDomain(userDto);
  }

  async register(data: RegisterData): Promise<UserEntity> {
    const userDto = await this.dataSource.register({
      username: data.username,
      password: data.password,
      role: (data.role as "ADMIN" | "OPERATOR" | "VIEWER") || "VIEWER",
    });
    return UserMapper.toDomain(userDto);
  }

  async getCurrentUser(): Promise<UserEntity> {
    const userDto = await this.dataSource.getCurrentUser();
    return UserMapper.toDomain(userDto);
  }

  async logout(): Promise<void> {
    await this.dataSource.logout();
  }

  async getCsrfToken(): Promise<string> {
    return this.dataSource.getCsrfToken();
  }
}

import type { UserDto } from "../schemas/auth.schema";
import { UserEntity, UserRole } from "~/domain/entities/user.entity";

export class UserMapper {
  static toDomain(dto: UserDto): UserEntity {
    return new UserEntity(
      dto.id,
      dto.username,
      dto.role as UserRole,
      new Date(dto.createdAt),
      dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    );
  }

  static toDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      username: entity.username,
      role: entity.role,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }
}

export enum UserRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isOperator(): boolean {
    return this.role === UserRole.OPERATOR;
  }

  isViewer(): boolean {
    return this.role === UserRole.VIEWER;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  canWrite(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.OPERATOR;
  }

  canDelete(): boolean {
    return this.role === UserRole.ADMIN;
  }
}

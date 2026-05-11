import type { AuditStatus, UserRole } from "../enums";
import type { User } from "./User";

/** Audit log entry. */
export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: AuditStatus;
  errorMessage: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "username" | "role">;
}

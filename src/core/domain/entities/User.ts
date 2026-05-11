import type { UserRole } from "../enums";

/** Authenticated operator profile. */
export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

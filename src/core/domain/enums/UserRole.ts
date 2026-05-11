/** Role enum for authenticated users. */
export const UserRole = {
  Admin: "Admin",
  Operator: "Operator",
  Viewer: "Viewer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

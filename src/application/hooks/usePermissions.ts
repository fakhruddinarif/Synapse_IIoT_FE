import { useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import type { Permission } from "@shared/constants";

/** RBAC helper for permission checks. */
export const usePermissions = () => {
  const permissions = useAuthStore((state) => state.permissions);

  return useMemo(
    () => ({
      can: (permission: Permission) => permissions.includes(permission),
      canAny: (required: Permission[]) =>
        required.some((permission) => permissions.includes(permission)),
      canAll: (required: Permission[]) =>
        required.every((permission) => permissions.includes(permission)),
    }),
    [permissions],
  );
};

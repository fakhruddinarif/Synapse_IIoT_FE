import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { usePermissions } from "@app/hooks";
import type { Permission } from "@shared/constants";
import { routePaths } from "./routePaths";

export interface PermissionRouteProps {
  permission: Permission;
  children: ReactNode;
}

/** RBAC gate for restricted routes. */
export const PermissionRoute = ({
  permission,
  children,
}: PermissionRouteProps) => {
  const { can } = usePermissions();
  if (!can(permission)) {
    return <Navigate to={routePaths.dashboard} replace />;
  }
  return <>{children}</>;
};

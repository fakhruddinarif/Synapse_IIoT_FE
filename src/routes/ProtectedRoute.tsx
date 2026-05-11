import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "@app/store/useAuthStore";
import { routePaths } from "./routePaths";

export interface ProtectedRouteProps {
  children: ReactNode;
}

/** Auth gate for protected routes. */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={routePaths.login} replace />;
  }
  return <>{children}</>;
};

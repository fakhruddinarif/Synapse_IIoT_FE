import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

/** Bootstraps auth session from the backend cookie. */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo().catch(() => undefined);
  }, [fetchUserInfo]);

  return <>{children}</>;
};

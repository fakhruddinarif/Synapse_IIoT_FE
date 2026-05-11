import type { LazyExoticComponent } from "react";
import { Suspense } from "react";
import { PageSkeleton } from "@ui/skeleton";
import { ErrorBoundary } from "@ui/components";
import ServerErrorPage from "@pages/errors/ServerErrorPage";
import { PermissionRoute } from "./PermissionRoute";
import type { Permission } from "@shared/constants";

export interface LazyPageProps {
  component: LazyExoticComponent<() => JSX.Element>;
  permission?: Permission;
}

/** Suspense + error boundary wrapper for lazy routes. */
export const LazyPage = ({
  component: Component,
  permission,
}: LazyPageProps) => {
  const content = (
    <Suspense fallback={<PageSkeleton />}>
      <ErrorBoundary fallback={<ServerErrorPage />}>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );

  if (permission) {
    return <PermissionRoute permission={permission}>{content}</PermissionRoute>;
  }

  return content;
};

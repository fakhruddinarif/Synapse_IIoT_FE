import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "@layouts";
import { AuthLayout } from "@layouts";
import { useAuthStore } from "@app/store/useAuthStore";
import { ProtectedRoute } from "./ProtectedRoute";
import { LazyPage } from "./LazyPage";
import { routePaths } from "./routePaths";
import { PERMISSIONS } from "@shared/constants";

const LoginPage = lazy(() => import("@pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@pages/dashboard/DashboardPage"));
const DevicesPage = lazy(() => import("@pages/devices/DevicesPage"));
const DeviceDetailPage = lazy(() => import("@pages/devices/DeviceDetailPage"));
const GatewayPage = lazy(() => import("@pages/gateway/GatewayPage"));
const AlarmsPage = lazy(() => import("@pages/alarms/AlarmsPage"));
const TagsPage = lazy(() => import("@pages/tags/TagsPage"));
const AnalyticsPage = lazy(() => import("@pages/analytics/AnalyticsPage"));
const SettingsPage = lazy(() => import("@pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("@pages/errors/NotFoundPage"));

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Navigate
      to={isAuthenticated ? routePaths.dashboard : routePaths.login}
      replace
    />
  );
}

export const router = createBrowserRouter([
  {
    path: routePaths.root,
    element: <RootRedirect />,
  },
  {
    path: routePaths.login,
    element: (
      <AuthLayout>
        <LazyPage component={LoginPage} />
      </AuthLayout>
    ),
  },
  {
    path: routePaths.dashboard,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={DashboardPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.devices,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={DevicesPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.deviceDetail,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={DeviceDetailPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.gateway,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={GatewayPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.alarms,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={AlarmsPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.tags,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage component={TagsPage} permission={PERMISSIONS.TAG_VIEW} />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.analytics,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={AnalyticsPage}
            permission={PERMISSIONS.DEVICE_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: routePaths.settings,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <LazyPage
            component={SettingsPage}
            permission={PERMISSIONS.SETTINGS_VIEW}
          />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <LazyPage component={NotFoundPage} />,
  },
]);

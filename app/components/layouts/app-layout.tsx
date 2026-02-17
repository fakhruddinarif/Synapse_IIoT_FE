import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { ProtectedRoute } from "~/components/protected-route";

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="border-b px-4 py-2">
            <SidebarTrigger />
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

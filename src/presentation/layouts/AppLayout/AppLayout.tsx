import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { Topbar } from "./Topbar/Topbar";
import { Toast } from "@ui/components";

export interface AppLayoutProps {
  children: ReactNode;
}

/** Authenticated application shell. */
const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="min-h-screen bg-canvas text-primary">
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    <Toast />
  </div>
);

export default AppLayout;

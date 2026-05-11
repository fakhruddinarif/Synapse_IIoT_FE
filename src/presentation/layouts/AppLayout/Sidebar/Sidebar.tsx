import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  Network,
  AlarmTriangle,
  Activity,
  Settings,
} from "lucide-react";
import { useUIStore } from "@app/store/useUIStore";
import { cn } from "@shared/utils";
import { routePaths } from "@/routes/routePaths";

const navItems = [
  { label: "Dashboard", to: routePaths.dashboard, icon: LayoutDashboard },
  { label: "Devices", to: routePaths.devices, icon: Cpu },
  { label: "Gateway", to: routePaths.gateway, icon: Network },
  { label: "Alarms", to: routePaths.alarms, icon: AlarmTriangle },
  { label: "Analytics", to: routePaths.analytics, icon: Activity },
  { label: "Settings", to: routePaths.settings, icon: Settings },
];

/** Side navigation for main sections. */
export const Sidebar = () => {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggle = useUIStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden h-screen border-r border-default bg-surface transition-all md:flex md:flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span
          className={cn(
            "text-sm font-semibold text-brand",
            collapsed && "hidden",
          )}
        >
          Synapse IIoT
        </span>
        <button
          onClick={toggle}
          className="rounded-md border border-default px-2 py-1 text-xs text-secondary"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-secondary hover:bg-subtle",
                isActive && "bg-subtle text-primary",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

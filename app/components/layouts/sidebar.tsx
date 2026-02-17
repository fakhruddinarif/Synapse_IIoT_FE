import { Link, useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { menus } from "./menu";
import type { MenuItem } from "~/types/menu.type";
import { ChevronRight, ChevronsUpDown, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "~/contexts/auth.context";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <i className="ri-earth-fill text-lg"></i>
          </div>
          <span className="font-semibold text-lg">Synapse IIoT</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu) => (
                <MenuItemComponent key={menu.title} item={menu} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-sidebar-primary-foreground">
                    <i className="ri-user-line text-lg"></i>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.username || "User"}
                    </span>
                    <span className="truncate text-xs capitalize">
                      {user?.role.toLowerCase() || "guest"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/change-password" className="cursor-pointer">
                    <KeyRound className="mr-2 size-4" />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500"
                >
                  <LogOut className="mr-2 size-4 text-red-500" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function MenuItemComponent({ item }: { readonly item: MenuItem }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path matches this menu item or any of its sub_menus
  const isActive = item.url === currentPath;
  const isParentActive = item.sub_menus?.some(
    (subMenu) => subMenu.url === currentPath,
  );

  // If menu has sub_menus, render as collapsible
  if (item.sub_menus && item.sub_menus.length > 0) {
    return (
      <Collapsible
        asChild
        defaultOpen={isParentActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
              {item.icon && <i className={item.icon}></i>}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.sub_menus.map((subMenu) => {
                const isSubMenuActive = subMenu.url === currentPath;
                return (
                  <SidebarMenuSubItem key={subMenu.title}>
                    <SidebarMenuSubButton asChild isActive={isSubMenuActive}>
                      <Link to={subMenu.url || "#"}>
                        {subMenu.icon && <i className={subMenu.icon}></i>}
                        <span>{subMenu.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // If no sub_menus, render as simple link
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link to={item.url || "#"}>
          {item.icon && <i className={item.icon}></i>}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

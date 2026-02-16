import type { MenuItem } from "~/types/menu.type";

export const menus: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "ri-dashboard-line",
    url: "/",
  },
  {
    title: "Connectivity",
    icon: "ri-plug-line",
    sub_menus: [
      {
        title: "Devices",
        icon: "ri-device-line",
        url: "/connectivity/devices",
      },
      {
        title: "Tag Manager",
        icon: "ri-hashtag",
        url: "/connectivity/tag-manager",
      },
      {
        title: "OPC UA Server",
        icon: "ri-server-line",
        url: "/connectivity/opc-ua-server",
      },
    ],
  },
];

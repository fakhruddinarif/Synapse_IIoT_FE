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
    ],
  },
  {
    title: "Data Engine",
    icon: "ri-database-line",
    sub_menus: [
      {
        title: "Dynamic Tables",
        icon: "ri-table-line",
        url: "/data-engine/dynamic-tables",
      },
      {
        title: "Storage Flows",
        icon: "ri-flow-chart",
        url: "/data-engine/storage-flows",
      },
    ],
  },
];

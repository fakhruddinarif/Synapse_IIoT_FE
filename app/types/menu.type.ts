export interface MenuItem {
  title: string;
  url?: string;
  icon?: string;
  sub_menus?: MenuItem[];
}

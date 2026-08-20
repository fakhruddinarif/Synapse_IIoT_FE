import type { ComponentType } from 'react'
import {
  RiDashboardLine,
  RiDashboardFill,
  RiPlugLine,
  RiPlugFill,
  RiRouterLine,
  RiRouterFill,
  RiPriceTag3Line,
  RiPriceTag3Fill,
  RiDatabase2Line,
  RiDatabase2Fill,
  RiTableLine,
  RiTableFill,
  RiFlowChart,
  RiExchangeFundsLine,
} from '@remixicon/react'
import type { UserRole } from '@/types/user'

type IconComponent = ComponentType<{ size?: string | number; className?: string }>

export interface MenuItem {
  /** Kunci i18n, bukan teks jadi — label menu ikut berganti bahasa. */
  label: string
  icon: IconComponent
  /** Varian `fill` yang dipakai saat item aktif. */
  iconActive?: IconComponent
  url: string
  subItems?: MenuItem[]
  roles?: UserRole[]
}

/**
 * Struktur menu mengikuti pembagian lapisan platform: apa yang menyentuh
 * perangkat (OT) dipisahkan dari apa yang mengelola data (IT). Itu bukan
 * sekadar pengelompokan rapi — dua lapisan itu dikerjakan oleh orang yang
 * berbeda, dan urutan kerjanya searah: perangkat dulu, tag-nya, lalu tabel
 * tujuan, baru storage flow yang menyambungkan keduanya.
 */
export const menuItems: MenuItem[] = [
  {
    label: 'nav.dashboard',
    icon: RiDashboardLine,
    iconActive: RiDashboardFill,
    url: '/',
  },
  {
    label: 'nav.connectivity',
    icon: RiPlugLine,
    iconActive: RiPlugFill,
    // Grup, bukan halaman. Rute `/connectivity` mengalihkan ke sub-item pertama
    // supaya tautan induk di breadcrumb dan flyout rail punya tujuan.
    url: '/connectivity',
    subItems: [
      {
        label: 'nav.devices',
        icon: RiRouterLine,
        iconActive: RiRouterFill,
        url: '/connectivity/devices',
      },
      {
        label: 'nav.tags',
        icon: RiPriceTag3Line,
        iconActive: RiPriceTag3Fill,
        url: '/connectivity/tags',
      },
    ],
  },
  {
    label: 'nav.dataEngine',
    icon: RiDatabase2Line,
    iconActive: RiDatabase2Fill,
    url: '/data-engine',
    subItems: [
      {
        label: 'nav.dynamicTables',
        icon: RiTableLine,
        iconActive: RiTableFill,
        url: '/data-engine/tables',
      },
      {
        label: 'nav.storageFlows',
        icon: RiFlowChart,
        iconActive: RiExchangeFundsLine,
        url: '/data-engine/storage-flows',
      },
    ],
  },
]

/**
 * `/` hanya cocok persis dengan dashboard — kalau tidak, setiap rute adalah
 * turunannya dan seluruh menu akan menyala sekaligus.
 */
export function isMenuUrlActive(url: string, pathname: string): boolean {
  if (url === '/') return pathname === '/'
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  if (isMenuUrlActive(item.url, pathname)) return true
  return item.subItems?.some((sub) => isMenuItemActive(sub, pathname)) ?? false
}

/** Tanpa role berarti belum login — sidebar tidak dirender sama sekali dalam
 *  keadaan itu (seluruh aplikasi berada di balik `ProtectedRoute`), jadi di sini
 *  role kosong berarti tidak ada menu, bukan menu penuh. */
export function filterMenuByRole(items: MenuItem[], role: UserRole | undefined | null): MenuItem[] {
  if (!role) return []
  return items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) =>
      item.subItems ? { ...item, subItems: filterMenuByRole(item.subItems, role) } : item,
    )
}

/**
 * Rantai item menu terdalam yang cocok dengan `pathname`, mis.
 * `/data-engine/tables` menghasilkan `[Data Engine, Dynamic Tables]`. Kosong
 * kalau rutenya memang bukan bagian menu — breadcrumb lalu jatuh ke segmen path
 * mentah.
 */
export function findMenuTrail(items: MenuItem[], pathname: string): MenuItem[] {
  for (const item of items) {
    if (item.subItems?.length) {
      const childTrail = findMenuTrail(item.subItems, pathname)
      if (childTrail.length > 0) return [item, ...childTrail]
    }
    if (isMenuUrlActive(item.url, pathname)) return [item]
  }
  return []
}

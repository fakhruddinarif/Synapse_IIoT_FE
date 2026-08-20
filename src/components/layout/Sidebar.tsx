import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { RiArrowDownSLine } from '@remixicon/react'
import { Popover } from '@/components/ui/Popover'
import { Logo } from './Logo'
import { classNames } from '@/lib/utils'
import { filterMenuByRole, isMenuItemActive, menuItems, type MenuItem } from '@/config/menu'
import { appTitle } from '@/config/app'
import { useAuthStore } from '@/store/auth.store'

const SIDEBAR_WIDTH = 256
const RAIL_WIDTH = 72

interface SidebarProps {
  /** Mode rail ikon. Diabaikan pada varian drawer, yang selalu penuh. */
  collapsed?: boolean
  variant?: 'fixed' | 'drawer'
  /** Dipanggil setelah sebuah tautan diikuti — untuk menutup drawer otomatis. */
  onNavigate?: () => void
  className?: string
}

/** Bentuk baris nav dipakai bersama supaya flyout rail identik dengan sidebar
 *  yang terbuka — kalau ditulis dua kali, keduanya akan menyimpang. */
const rowBase =
  'group relative flex items-center rounded-button text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent'

const rowIdle =
  'text-gray-600 hover:bg-white/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'

const rowActive =
  'bg-brand-500 text-white shadow-[0_1px_3px_rgb(196_59_101/0.35)] dark:ring-1 dark:ring-brand-300/25'

export function Sidebar({
  collapsed = false,
  variant = 'fixed',
  onNavigate,
  className,
}: SidebarProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const role = useAuthStore((s) => s.user?.role)
  const [openGroups, setOpenGroups] = useState<string[]>([])

  const isDrawer = variant === 'drawer'
  const isRail = collapsed && !isDrawer

  const items = filterMenuByRole(menuItems, role)

  // Grup yang memuat halaman aktif dibuka sendiri. Tanpa ini, membuka
  // /data-engine/storage-flows langsung dari URL menampilkan sidebar dengan
  // semua grup tertutup dan tidak ada petunjuk di mana operator sedang berada.
  useEffect(() => {
    const activeGroups = items
      .filter((item) => item.subItems?.length && isMenuItemActive(item, pathname))
      .map((item) => item.url)
    if (activeGroups.length === 0) return
    setOpenGroups((previous) => [...new Set([...previous, ...activeGroups])])
    // `items` diturunkan dari konfigurasi statis + role; pathname yang benar-benar
    // memicu perubahan di sini.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function toggleGroup(url: string) {
    setOpenGroups((previous) =>
      previous.includes(url) ? previous.filter((item) => item !== url) : [...previous, url],
    )
  }

  function renderIcon(item: MenuItem, active: boolean) {
    const Icon = active && item.iconActive ? item.iconActive : item.icon
    return <Icon size={20} className="shrink-0" />
  }

  function renderSubLink(sub: MenuItem, inFlyout = false) {
    return (
      <NavLink
        key={sub.url}
        to={sub.url}
        onClick={onNavigate}
        className={({ isActive }) =>
          classNames(
            'block rounded-button px-3 py-2 text-sm transition-colors duration-200',
            inFlyout ? '' : 'ml-[26px] border-l border-chrome-soft pl-4',
            isActive
              ? 'bg-brand-100 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
              : 'text-gray-500 hover:bg-white/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
          )
        }
      >
        {t(sub.label)}
      </NavLink>
    )
  }

  function renderItem(item: MenuItem) {
    const active = isMenuItemActive(item, pathname)
    const hasSubs = Boolean(item.subItems?.length)
    const expanded = openGroups.includes(item.url)

    // --- Rail ikon: hover pada ikon memunculkan flyout yang bisa diklik. ---
    if (isRail) {
      return (
        <Popover
          key={item.url}
          position="right"
          triggerClassName="block w-full"
          panelClassName="min-w-[196px]"
          content={
            <div className="py-0.5">
              <NavLink
                to={hasSubs ? (item.subItems?.[0]?.url ?? item.url) : item.url}
                onClick={onNavigate}
                className={classNames(
                  'block whitespace-nowrap rounded-button px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5',
                )}
              >
                {t(item.label)}
              </NavLink>
              {hasSubs && (
                <div className="mt-1 space-y-0.5 border-t border-gray-100 pt-1 dark:border-gray-800">
                  {item.subItems?.map((sub) => renderSubLink(sub, true))}
                </div>
              )}
            </div>
          }
        >
          <NavLink
            to={hasSubs ? (item.subItems?.[0]?.url ?? item.url) : item.url}
            onClick={onNavigate}
            aria-label={t(item.label)}
            className={classNames(rowBase, 'h-11 w-full justify-center', active ? rowActive : rowIdle)}
          >
            {renderIcon(item, active)}
            {hasSubs && (
              <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-pill bg-current opacity-50" />
            )}
          </NavLink>
        </Popover>
      )
    }

    // --- Terbuka: induk dengan anak membuka/menutup, bukan bernavigasi. ---
    if (hasSubs) {
      return (
        <div key={item.url}>
          <button
            type="button"
            onClick={() => toggleGroup(item.url)}
            aria-expanded={expanded}
            className={classNames(rowBase, 'h-11 w-full gap-3 px-3', active ? rowActive : rowIdle)}
          >
            {renderIcon(item, active)}
            <span className="flex-1 truncate text-left">{t(item.label)}</span>
            <RiArrowDownSLine
              size={16}
              className={classNames(
                'shrink-0 transition-transform duration-200',
                expanded ? 'rotate-180' : '',
                active ? 'opacity-80' : 'opacity-50',
              )}
            />
          </button>
          {expanded && (
            <div className="mt-1 space-y-0.5">
              {item.subItems?.map((sub) => renderSubLink(sub))}
            </div>
          )}
        </div>
      )
    }

    // --- Terbuka: tautan tunggal. ---
    return (
      <NavLink
        key={item.url}
        to={item.url}
        onClick={onNavigate}
        className={({ isActive }) =>
          classNames(rowBase, 'h-11 gap-3 px-3', isActive || active ? rowActive : rowIdle)
        }
      >
        {renderIcon(item, active)}
        <span className="flex-1 truncate">{t(item.label)}</span>
      </NavLink>
    )
  }

  return (
    <aside
      className={classNames(
        'flex flex-col border-r border-chrome bg-chrome-sidebar',
        isDrawer
          ? 'h-full w-64'
          : 'hidden h-full shrink-0 transition-[width] duration-200 ease-in-out md:flex',
        className,
      )}
      style={isDrawer ? undefined : { width: isRail ? RAIL_WIDTH : SIDEBAR_WIDTH }}
    >
      <div
        className={classNames(
          'flex h-16 shrink-0 items-center border-b border-chrome',
          isRail ? 'justify-center px-2' : 'gap-3 px-4',
        )}
      >
        <Logo className="h-9 w-9 shrink-0" />
        {!isRail && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              {appTitle}
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('app.tagline')}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
        {!isRail && (
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {t('nav.section.main')}
          </p>
        )}
        {items.map(renderItem)}
      </nav>

      {!isRail && (
        <div className="shrink-0 border-t border-chrome px-4 py-3">
          <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
            {t('app.subtitle')}
          </p>
        </div>
      )}
    </aside>
  )
}

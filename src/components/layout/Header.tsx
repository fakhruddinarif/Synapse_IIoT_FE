import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  RiSunLine,
  RiMoonLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiPulseLine,
} from '@remixicon/react'
import { classNames } from '@/lib/utils'
import { roleLabelKey } from '@/types/user'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useLanguageStore } from '@/store/language.store'
import { useRealtimeStore } from '@/store/realtime.store'
import { useFullscreen } from '@/hooks/useFullscreen'
import { logout as logoutRequest } from '@/services/auth.service'
import { disconnectHub } from '@/lib/signalr'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { FlagGB, FlagID } from '@/components/ui/Flag'
import { Breadcrumb } from './Breadcrumb'

interface HeaderProps {
  collapsed: boolean
  /** Desktop (md+): ciutkan sidebar ke rail ikon. */
  onToggleCollapse: () => void
  /** Di bawah md: buka sidebar sebagai drawer melayang. */
  onToggleDrawer: () => void
  className?: string
}

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-button text-gray-500 transition-colors hover:bg-white/70 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-200'

const divider = 'h-6 w-px bg-[var(--chrome-line)]'

/**
 * Chip bendera 20×12 — lebar 20px menyamai ikon di sebelahnya, dan kotak 5:3
 * cukup dekat dengan rasio asli Union Jack (2:1) sehingga `slice` hanya memangkas
 * ~2px per sisi alih-alih memiringkan saltire-nya.
 */
const flagChip = 'h-3 w-5 shrink-0 rounded-sm ring-1 ring-black/10 dark:ring-white/15'

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function Header({ collapsed, onToggleCollapse, onToggleDrawer, className }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)
  const { theme, toggle: toggleTheme } = useThemeStore()
  const toggleLanguage = useLanguageStore((s) => s.toggle)
  const connected = useRealtimeStore((s) => s.connected)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  const isId = i18n.language.startsWith('id')
  const sidebarLabel = collapsed ? t('sidebar.expand') : t('sidebar.collapse')

  async function handleLogout() {
    try {
      await logoutRequest()
    } catch {
      // Cookie hanya bisa dihapus server, tapi kalau requestnya gagal (gateway
      // mati) sesi lokal tetap harus dibersihkan — kalau tidak, operator terjebak
      // melihat UI ter-login yang setiap requestnya berakhir 401.
      toast.error(t('auth.logoutFailed'))
    } finally {
      await disconnectHub()
      clearSession()
      navigate('/login', { replace: true })
    }
  }

  return (
    <header
      className={classNames(
        'flex h-16 shrink-0 items-center gap-3 border-b border-chrome bg-chrome-header px-4 lg:px-5',
        className,
      )}
    >
      {/* Satu hamburger, dua perilaku — rail di desktop, drawer di bawah md.
          Sakelar hidden/visible ada di pembungkusnya supaya gap flex tidak
          menyisakan ruang untuk tombol yang sedang tidak aktif. */}
      <span className="hidden md:block">
        <Tooltip content={sidebarLabel} position="bottom">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={sidebarLabel}
            aria-expanded={!collapsed}
            className={iconButton}
          >
            <RiMenuLine size={20} />
          </button>
        </Tooltip>
      </span>
      <button
        type="button"
        onClick={onToggleDrawer}
        aria-label={t('sidebar.open')}
        className={`md:hidden ${iconButton}`}
      >
        <RiMenuLine size={20} />
      </button>

      <span className={`hidden sm:block ${divider}`} />

      <Breadcrumb pathname={pathname} />

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {/* Status hub. Ditempatkan di chrome, bukan di dalam halaman, karena
            artinya sama di setiap halaman: kalau mati, semua angka yang terlihat
            adalah data terakhir yang diketahui — bukan keadaan sekarang. */}
        <Tooltip
          content={connected ? t('gateway.connected') : t('gateway.disconnected')}
          position="bottom"
        >
          <span
            className={classNames(
              'flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold',
              connected
                ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              {connected && (
                <span
                  aria-hidden
                  className="animate-status-pulse absolute inset-0 rounded-full bg-success-500"
                />
              )}
              <span
                className={classNames(
                  'relative h-1.5 w-1.5 rounded-full',
                  connected ? 'bg-success-500' : 'bg-gray-400',
                )}
              />
            </span>
            <RiPulseLine size={12} className="hidden sm:block" />
            <span className="hidden lg:inline">{t('gateway.streamLabel')}</span>
          </span>
        </Tooltip>

        <span className={`mx-1 hidden sm:block ${divider}`} />

        <Tooltip content={t('lang.switch')} position="bottom">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('lang.switch')}
            className={iconButton}
          >
            {isId ? <FlagID className={flagChip} /> : <FlagGB className={flagChip} />}
          </button>
        </Tooltip>

        <Tooltip content={theme === 'dark' ? t('theme.light') : t('theme.dark')} position="bottom">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            className={iconButton}
          >
            {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>
        </Tooltip>

        <Tooltip
          content={isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')}
          position="bottom"
        >
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')}
            className={iconButton}
          >
            {isFullscreen ? <RiFullscreenExitLine size={20} /> : <RiFullscreenLine size={20} />}
          </button>
        </Tooltip>

        <span className={`mx-1 hidden sm:block ${divider}`} />

        {user && (
          <Dropdown
            trigger={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2.5 rounded-button py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-white/70 dark:hover:bg-white/5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {getInitials(user.username)}
                </div>
                <div className="hidden text-left leading-tight lg:block">
                  <p className="max-w-32 truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t(roleLabelKey(user.role))}
                  </p>
                </div>
              </button>
            }
            align="right"
            className="mt-1.5 w-52"
          >
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user.username}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {t(roleLabelKey(user.role))}
              </p>
            </div>
            <div className="py-1">
              <DropdownItem
                icon={<RiLogoutBoxLine size={16} />}
                onClick={() => void handleLogout()}
                danger
              >
                {t('nav.logout')}
              </DropdownItem>
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  )
}

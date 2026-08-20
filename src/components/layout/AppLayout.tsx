import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { FullscreenExit } from './FullscreenExit'
import { AuroraBackdrop } from './AuroraBackdrop'
import { Offcanvas } from '@/components/ui/Offcanvas'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useHubConnection } from '@/hooks/useDeviceStream'
import { useUiStore } from '@/store/ui.store'
import { classNames } from '@/lib/utils'
import { appTitle, platformRole } from '@/config/app'

export function AppLayout() {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleCollapsed = useUiStore((s) => s.toggleSidebarCollapsed)
  const { isFullscreen } = useFullscreen()

  // Koneksi hub dibuka sekali di sini, bukan per halaman: indikator di header
  // harus jujur di halaman mana pun, dan membuka-tutup WebSocket setiap kali
  // operator berpindah menu hanya membuang waktu negosiasi.
  useHubConnection()

  // Drawer menutupi konten, jadi ia tidak boleh bertahan melewati navigasi.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="relative flex h-screen overflow-hidden bg-chrome-content">
      {/* Latar beranimasi berada di lapisan paling bawah; seluruh chrome dan
          konten di atasnya memakai `relative z-10`. Elemen berposisi selalu
          tergambar di atas yang tidak, dan tanpa penanda itu sidebar akan
          tertimbun lapisan hias ini. */}
      <AuroraBackdrop />

      {!isFullscreen && (
        <>
          <Sidebar collapsed={collapsed} className="relative z-10" />
          <Offcanvas bare open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Sidebar variant="drawer" onNavigate={() => setDrawerOpen(false)} />
          </Offcanvas>
        </>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        {!isFullscreen && (
          <Header
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
            onToggleDrawer={() => setDrawerOpen((open) => !open)}
          />
        )}

        {/* Kolom flex, bukan blok biasa: `flex-1` pada area isi mendorong footer
            ke dasar layar walau kontennya pendek, sekaligus memberi mode kios
            tinggi pasti yang dibutuhkan widget `h-full` di dalamnya. */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className={classNames('flex-1', isFullscreen ? 'min-h-0 p-6' : 'p-4 lg:p-6')}>
            <Outlet />
          </div>

          {!isFullscreen && (
            <footer className="shrink-0 border-t border-chrome px-6 py-3">
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                {appTitle} — {platformRole}
              </p>
            </footer>
          )}
        </main>
      </div>

      {isFullscreen && <FullscreenExit />}
    </div>
  )
}

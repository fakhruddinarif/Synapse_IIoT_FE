import { useCallback, useEffect, useState } from 'react'

/**
 * Pembungkus Fullscreen API. Berlangganan `fullscreenchange` supaya setiap
 * pemakai tetap sinkron ketika pengguna keluar dengan ESC, bukan lewat tombol
 * di aplikasi. Catatan: F11 milik browser bukan Fullscreen API dan tidak
 * memicu event ini.
 *
 * Mode ini dipakai untuk menampilkan dashboard pada layar besar di ruang
 * kontrol, di mana chrome aplikasi hanya memakan tempat.
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && Boolean(document.fullscreenElement),
  )

  useEffect(() => {
    function sync() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const enter = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // Browser menolak (tanpa gesture pengguna, atau diblokir kebijakan).
    }
  }, [])

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return
    try {
      await document.exitFullscreen()
    } catch {
      // Sedang keluar — listener `fullscreenchange` yang akan menyelesaikan.
    }
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void exit()
    } else {
      void enter()
    }
  }, [enter, exit])

  return { isFullscreen, enter, exit, toggle }
}

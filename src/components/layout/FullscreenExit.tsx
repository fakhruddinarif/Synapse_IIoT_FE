import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiFullscreenExitLine } from '@remixicon/react'
import { classNames } from '@/lib/utils'
import { useFullscreen } from '@/hooks/useFullscreen'

const IDLE_MS = 2500

/**
 * Jalan keluar dari mode kios. Di layar besar ruang kontrol chrome-nya hilang
 * seluruhnya dan tidak ada petunjuk cara kembali — jadi sisakan satu afordansi
 * redup yang bangun pada input apa pun. ESC tetap bekerja secara native.
 */
export function FullscreenExit() {
  const { t } = useTranslation()
  const { exit } = useFullscreen()
  const [awake, setAwake] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function wake() {
      setAwake(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setAwake(false), IDLE_MS)
    }

    wake()
    window.addEventListener('mousemove', wake)
    window.addEventListener('keydown', wake)
    window.addEventListener('touchstart', wake)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', wake)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('touchstart', wake)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => void exit()}
      aria-label={t('fullscreen.exit')}
      className={classNames(
        'fixed right-4 top-4 z-[80] flex items-center gap-2 rounded-pill border border-chrome bg-white/85 py-1.5 pl-3 pr-2 text-gray-600 shadow-dropdown backdrop-blur transition-opacity duration-300',
        'hover:opacity-100! focus-visible:opacity-100! hover:text-brand-600',
        'dark:bg-gray-900/80 dark:text-gray-300 dark:hover:text-brand-200',
        awake ? 'opacity-100' : 'opacity-25',
      )}
    >
      <RiFullscreenExitLine size={16} />
      <span className="hidden text-xs font-medium sm:inline">{t('fullscreen.exit')}</span>
      <kbd className="rounded border border-chrome px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">
        ESC
      </kbd>
    </button>
  )
}

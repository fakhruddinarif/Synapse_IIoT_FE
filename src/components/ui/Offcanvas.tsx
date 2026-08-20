import { useEffect, type ReactNode } from 'react'
import { classNames } from '@/lib/utils'
import { Card } from './Card'

interface OffcanvasProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  position?: 'left' | 'right'
  className?: string
  /** Lewati pembungkus Card supaya anaknya memiliki permukaannya sendiri —
   *  dipakai sidebar, yang latar gradasinya harus menempel ke tepi panel. */
  bare?: boolean
}

export function Offcanvas({
  open,
  onClose,
  children,
  position = 'left',
  className,
  bare = false,
}: OffcanvasProps) {
  useEffect(() => {
    const previous = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Tutup"
          className="fixed inset-0 z-40 cursor-default bg-brand-950/40 transition-opacity duration-200 dark:bg-black/60"
          onClick={onClose}
        />
      )}

      {/* Panel tetap ter-mount di luar layar supaya bisa meluncur; `inert`
          menjaga tautannya keluar dari urutan tab dan a11y tree saat tertutup. */}
      <div
        inert={!open}
        className={classNames(
          'fixed top-0 z-50 h-full transition-transform duration-200',
          position === 'left' ? 'left-0' : 'right-0',
          position === 'left' && (open ? 'translate-x-0' : '-translate-x-full'),
          position === 'right' && (open ? 'translate-x-0' : 'translate-x-full'),
          className,
        )}
      >
        {bare ? (
          <div className="h-full shadow-modal">{children}</div>
        ) : (
          <Card className="h-full rounded-none border-0 shadow-modal" padding="none">
            {children}
          </Card>
        )}
      </div>
    </>
  )
}

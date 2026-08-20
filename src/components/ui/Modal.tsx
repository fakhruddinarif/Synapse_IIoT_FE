import { useEffect, useRef, type ReactNode } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { classNames } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** `false` untuk alur yang tidak boleh ditinggalkan setengah jalan — tanpa
   *  tombol X, tanpa Escape, tanpa klik backdrop. */
  dismissable?: boolean
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissable = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

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
    if (open && dismissable) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, dismissable, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 p-4 backdrop-blur-[2px] dark:bg-black/60"
      onClick={(event) => {
        if (dismissable && event.target === overlayRef.current) onClose()
      }}
    >
      {/* `max-h` + kolom flex: kepala dan footer tetap terlihat sementara isinya
          menggulir. Form perangkat dan storage flow bisa lebih tinggi dari layar
          laptop, dan tombol Simpan tidak boleh ikut terdorong ke bawah lipatan. */}
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(
          'flex max-h-[92vh] w-full flex-col rounded-modal border border-gray-200 bg-white shadow-modal dark:border-gray-800 dark:bg-gray-900',
          sizeStyles[size],
        )}
      >
        {title && (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
              {description && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
            {dismissable && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="-mr-1.5 -mt-1 shrink-0 rounded-button p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <RiCloseLine size={18} />
              </button>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

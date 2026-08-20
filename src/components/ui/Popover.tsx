import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { classNames } from '@/lib/utils'

interface PopoverProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  gap?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Mengganti kelas display pembungkus trigger — beri `block w-full` untuk
   *  baris nav selebar sidebar. Default `inline-flex`. */
  triggerClassName?: string
  panelClassName?: string
}

const VIEWPORT_MARGIN = 8

/**
 * Flyout yang dibuka hover, dipakai rail sidebar saat diciutkan. Panelnya
 * `fixed`, bukan absolut relatif trigger: sidebar punya `overflow-y-auto`
 * sendiri, dan panel absolut akan terpotong di tepinya alih-alih melayang di
 * atas konten.
 */
export function Popover({
  children,
  content,
  position = 'right',
  gap = 8,
  open: controlledOpen,
  onOpenChange,
  triggerClassName,
  panelClassName,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [coords, setCoords] = useState<CSSProperties | null>(null)

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value)
      } else {
        setInternalOpen(value)
      }
    },
    [isControlled, onOpenChange],
  )

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  // Jeda saat kursor keluar: tanpa itu, menyeberang dari ikon ke panel melewati
  // celah `gap` piksel dan flyout-nya tertutup sebelum tangan sampai.
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }

  // Diukur setelah panel ter-mount supaya bisa dijepit terhadap tingginya yang
  // sebenarnya — flyout dari baris nav terakhir tidak boleh keluar layar.
  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }
    const trigger = triggerRef.current
    if (!trigger) return
    setCoords(computePosition(trigger.getBoundingClientRect(), contentRef.current, position, gap))
  }, [open, position, gap])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={triggerRef}
      className={classNames('relative', triggerClassName ?? 'inline-flex')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {open && (
        <div
          ref={contentRef}
          className="fixed z-[60]"
          style={{ ...coords, visibility: coords ? 'visible' : 'hidden' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={classNames(
              'overflow-y-auto rounded-card border border-gray-200 bg-white p-1 shadow-dropdown dark:border-gray-700 dark:bg-gray-900',
              panelClassName,
            )}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

function computePosition(
  rect: DOMRect,
  content: HTMLElement | null,
  position: string,
  gap: number,
): CSSProperties {
  const contentHeight = content?.offsetHeight ?? 0
  const maxHeight = window.innerHeight - VIEWPORT_MARGIN * 2

  const clampTop = (preferred: number) =>
    Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        preferred,
        window.innerHeight - VIEWPORT_MARGIN - Math.min(contentHeight, maxHeight),
      ),
    )

  switch (position) {
    case 'right':
      return { left: rect.right + gap, top: clampTop(rect.top), maxHeight }
    case 'left':
      return { left: rect.left - gap, top: clampTop(rect.top), maxHeight }
    case 'bottom':
      return { left: rect.left, top: rect.bottom + gap, maxHeight }
    case 'top':
      return { left: rect.left, top: rect.top - gap, maxHeight }
    default:
      return {}
  }
}

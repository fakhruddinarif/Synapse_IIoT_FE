import { useEffect, useRef, useState, type ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ children, content, position = 'top', delay = 400 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (containerRef.current) {
        setCoords(getTooltipPosition(containerRef.current.getBoundingClientRect(), position))
      }
      setVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[70] -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-dropdown dark:bg-gray-100 dark:text-gray-900"
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

function getTooltipPosition(rect: DOMRect, position: string): { top: number; left: number } {
  const gap = 8
  switch (position) {
    case 'top':
      return { top: rect.top - gap - 24, left: rect.left + rect.width / 2 }
    case 'bottom':
      return { top: rect.bottom + gap, left: rect.left + rect.width / 2 }
    case 'left':
      return { top: rect.top + rect.height / 2 - 12, left: rect.left - gap }
    case 'right':
      return { top: rect.top + rect.height / 2 - 12, left: rect.right + gap }
    default:
      return { top: rect.top, left: rect.left }
  }
}

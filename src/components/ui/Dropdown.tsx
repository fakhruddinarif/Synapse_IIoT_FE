import { useEffect, useRef, useState, type ReactNode } from 'react'
import { classNames } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={classNames(
            'absolute top-full z-50 mt-1 min-w-40 rounded-card border border-gray-200 bg-white py-1 shadow-dropdown dark:border-gray-700 dark:bg-gray-900',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
          // Menutup setelah item dipilih. Dipasang di pembungkus, bukan di
          // setiap item, supaya `DropdownItem` tidak perlu tahu soal dropdown
          // yang menampungnya.
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  icon?: ReactNode
}

export function DropdownItem({ children, onClick, danger, disabled, icon }: DropdownItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors disabled:pointer-events-none disabled:opacity-50',
        danger
          ? 'text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

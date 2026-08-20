import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

export interface TabItem {
  key: string
  label: string
  icon?: ReactNode
  count?: number
}

interface TabsProps {
  items: TabItem[]
  active: string
  onChange: (key: string) => void
  className?: string
}

/** Tab garis bawah — untuk berpindah irisan data dalam satu halaman (mis. per
 *  protokol pada daftar perangkat), bukan untuk navigasi antar halaman. */
export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={classNames(
        'flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.key)}
            className={classNames(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'border-brand-500 text-brand-600 dark:border-brand-300 dark:text-brand-200'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            )}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span
                className={classNames(
                  'rounded-pill px-1.5 py-0.5 text-[11px] font-semibold',
                  isActive
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

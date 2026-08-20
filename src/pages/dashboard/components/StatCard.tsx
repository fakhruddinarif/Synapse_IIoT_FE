import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

type StatTone = 'brand' | 'success' | 'warning' | 'accent'

interface StatCardProps {
  label: string
  value: number | string
  hint?: string
  icon: ReactNode
  tone?: StatTone
}

const toneStyles: Record<StatTone, string> = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300',
}

/**
 * Kartu angka. `tnum` pada nilainya bukan detail kosmetik: angka-angka ini
 * berubah saat data baru masuk, dan dengan angka proporsional lebarnya bergeser
 * di setiap pembaruan sehingga seluruh baris kartu ikut bergoyang.
 */
export function StatCard({ label, value, hint, icon, tone = 'brand' }: StatCardProps) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-4 shadow-card dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <span
          className={classNames(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-button',
            toneStyles[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <p className="tnum mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  )
}

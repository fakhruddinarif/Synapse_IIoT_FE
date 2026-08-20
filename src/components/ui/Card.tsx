import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

/** Permukaan rata di atas kanvas bergradasi. Kartu tidak pernah memakai
 *  gradasi sendiri: itulah yang membuatnya terbaca sebagai lapisan di atas
 *  latar, bukan bagian dari latar. */
export function Card({ children, className, padding = 'md', hoverable, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'rounded-card border border-gray-200 bg-white shadow-card dark:border-gray-800 dark:bg-gray-900',
        paddingMap[padding],
        hoverable && 'cursor-pointer transition-shadow duration-200 hover:shadow-dropdown',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/** Kepala kartu baku: judul + deskripsi di kiri, satu aksi di kanan. Dipisah
 *  supaya jarak dan hierarki tipografinya tidak ditulis ulang per halaman. */
export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={classNames('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

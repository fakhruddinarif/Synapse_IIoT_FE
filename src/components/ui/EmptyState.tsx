import type { ReactNode } from 'react'
import { RiInboxLine } from '@remixicon/react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
}

export function EmptyState({
  icon,
  title = 'Tidak ada data',
  description,
  actionLabel,
  onAction,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? 'flex flex-col items-center justify-center py-8 text-center'
          : 'flex flex-col items-center justify-center py-16 text-center'
      }
    >
      <div className="mb-4 text-brand-300 dark:text-brand-500/60">
        {icon ?? <RiInboxLine size={compact ? 32 : 48} />}
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

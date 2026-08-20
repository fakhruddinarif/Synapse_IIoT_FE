import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand' | 'accent'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  dot?: boolean
  /** Denyut di belakang titik — hanya untuk status yang benar-benar hidup
   *  (perangkat online, flow sedang menulis), bukan sebagai hiasan. */
  pulse?: boolean
  mono?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
  error: 'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400',
  info: 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-300',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300',
}

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  neutral: 'bg-gray-400',
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
}

export function Badge({
  variant = 'neutral',
  children,
  className,
  dot,
  pulse,
  mono,
}: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        mono && 'font-mono',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              aria-hidden
              className={classNames(
                'absolute inset-0 rounded-full animate-status-pulse',
                dotStyles[variant],
              )}
            />
          )}
          <span className={classNames('relative h-1.5 w-1.5 rounded-full', dotStyles[variant])} />
        </span>
      )}
      {children}
    </span>
  )
}

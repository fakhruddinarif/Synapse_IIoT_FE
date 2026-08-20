import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  className?: string
}

/**
 * Dipakai khusus untuk sakelar berdampak: mengaktifkan perangkat berarti worker
 * backend mulai menghubunginya; mengaktifkan storage flow berarti data mulai
 * ditulis ke tabel. Sakelar dipilih ketimbang checkbox karena keadaannya
 * ("nyala" vs "mati") harus terbaca sekilas dari seberang ruangan, bukan hanya
 * "tercentang".
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: SwitchProps) {
  return (
    <div className={classNames('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={classNames(
          'relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-pill transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700',
        )}
      >
        <span
          className={classNames(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-4.5' : 'translate-x-0.5',
          )}
        />
      </button>
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

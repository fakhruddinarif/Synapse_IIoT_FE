import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'
import { RiArrowDownSLine } from '@remixicon/react'
import { classNames } from '@/lib/utils'
import { RequiredMark } from './RequiredMark'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: ReactNode
  error?: string
  options: SelectOption[]
  placeholder?: string
  isFullWidth?: boolean
}

/**
 * `<select>` native, bukan listbox kustom. Di panel yang dipakai lewat layar
 * sentuh maupun keyboard, kontrol native memberi perilaku yang benar secara
 * gratis: pencarian dengan mengetik, gulir yang mengikuti jari, dan penempatan
 * popup yang tak pernah keluar layar.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, hint, error, options, placeholder, isFullWidth, className, id, required, ...props },
    ref,
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={classNames(isFullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <RequiredMark />}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            className={classNames(
              'block w-full appearance-none rounded-input border bg-white px-3 py-2 pr-10 text-sm transition-colors duration-150',
              'focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:bg-gray-900 dark:text-gray-100',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-gray-300 dark:border-gray-700',
              !props.value && placeholder ? 'text-gray-400 dark:text-gray-500' : '',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <RiArrowDownSLine size={16} />
          </span>
        </div>

        {hint && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
        {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

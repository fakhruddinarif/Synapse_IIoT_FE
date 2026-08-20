import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { classNames } from '@/lib/utils'
import { RequiredMark } from './RequiredMark'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: ReactNode
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isFullWidth?: boolean
  /** Untuk URL, topik MQTT, JSONPath — teks teknis yang lebih mudah diperiksa
   *  karakter demi karakter dengan lebar tetap. */
  mono?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leftIcon, rightIcon, isFullWidth, mono, className, id, required, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={classNames(isFullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <RequiredMark />}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            className={classNames(
              'block w-full rounded-input border bg-white px-3 py-2 text-sm transition-colors duration-150',
              'placeholder:text-gray-400',
              'focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              mono && 'font-mono text-[13px]',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-gray-300 dark:border-gray-700',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {hint && !error && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

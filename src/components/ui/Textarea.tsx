import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { classNames } from '@/lib/utils'
import { RequiredMark } from './RequiredMark'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: ReactNode
  error?: string
  isFullWidth?: boolean
  mono?: boolean
}

/** Untuk deskripsi dan payload JSON (mis. header HTTP kustom, body uji
 *  koneksi) — teks yang panjangnya tidak diketahui di muka. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, isFullWidth, mono, className, id, required, rows = 3, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={classNames(isFullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={areaId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <RequiredMark />}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
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
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
        {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

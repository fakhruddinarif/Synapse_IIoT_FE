import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { RiCheckLine } from '@remixicon/react'
import { classNames } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  description?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, disabled, ...props }, ref) => {
    const checkboxId =
      id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={classNames('flex items-start gap-2.5', className)}>
        <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className="peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-gray-300 bg-white transition-colors checked:border-brand-500 checked:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900"
            {...props}
          />
          <RiCheckLine
            size={12}
            className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
          />
        </div>
        <div className="min-w-0">
          <label
            htmlFor={checkboxId}
            className={classNames(
              'block text-sm font-medium text-gray-700 dark:text-gray-300',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
          >
            {label}
          </label>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

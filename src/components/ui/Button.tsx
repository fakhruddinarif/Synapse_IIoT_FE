import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'
import { classNames } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/**
 * Permukaan tombol dibuat RATA — tanpa gradasi. Gradasi di sistem ini adalah
 * bahasa untuk chrome (latar aplikasi), bukan untuk kontrol; memberi gradasi
 * pada tombol membuat batas antara "yang bisa diklik" dan "yang cuma latar"
 * jadi kabur, dan itu mahal di panel yang dibaca sambil berdiri.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 active:scale-[0.98]',
  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800',
  // Aksen brand pucat — untuk aksi sekunder yang tetap ingin terasa bagian dari
  // alur utama (mis. "Tambah Mapping" di dalam form).
  subtle:
    'bg-brand-100 text-brand-700 hover:bg-brand-200 focus:ring-brand-400 active:scale-[0.98] dark:bg-brand-500/15 dark:text-brand-200 dark:hover:bg-brand-500/25',
  ghost:
    'text-gray-600 hover:bg-gray-100 focus:ring-gray-400 active:scale-[0.98] dark:text-gray-400 dark:hover:bg-gray-800',
  danger: 'bg-error-600 text-white hover:bg-error-500 focus:ring-error-500 active:scale-[0.98]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
  icon: 'h-9 w-9 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'inline-flex shrink-0 items-center justify-center rounded-button font-medium whitespace-nowrap transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}

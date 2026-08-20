import { classNames } from '@/lib/utils'

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-[2.5px]',
  lg: 'h-10 w-10 border-[3px]',
}

export function Spinner({ size = 'md' }: { size?: keyof typeof sizeMap }) {
  return (
    <div
      className={classNames(
        'animate-spin rounded-full border-gray-300 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-300',
        sizeMap[size],
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

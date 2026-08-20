import { classNames } from '@/lib/utils'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-card',
  full: 'rounded-pill',
}

export function Skeleton({ width, height, rounded = 'md', className }: SkeletonProps) {
  return (
    <div
      className={classNames(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        roundedMap[rounded],
        className,
      )}
      style={{ width, height }}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Bentuk siap pakai — supaya setiap halaman tidak merakit skeletonnya sendiri */
/* -------------------------------------------------------------------------- */

export function SkeletonText({ width = '100%', lines = 1 }: { width?: string; lines?: number }) {
  return (
    <div className={classNames('flex flex-col', lines > 1 && 'gap-2')}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? '60%' : width}
          height={12}
          rounded="full"
        />
      ))}
    </div>
  )
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} rounded="full" />
}

/** Kartu ringkasan. `count` sengaja default 4 karena itu jumlah kartu statistik
 *  di dashboard — keadaan memuat harus punya bentuk yang sama dengan hasilnya,
 *  kalau tidak layoutnya melompat saat data tiba. */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-card border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <Skeleton width="45%" height={10} rounded="full" />
          <Skeleton width="60%" height={28} rounded="md" className="mt-3" />
          <Skeleton width="35%" height={10} rounded="full" className="mt-3" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-card border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <Skeleton width="55%" height={14} rounded="full" />
          <Skeleton width="80%" height={10} rounded="full" className="mt-3" />
          <Skeleton width="40%" height={10} rounded="full" className="mt-2" />
          <div className="mt-5 flex gap-2">
            <Skeleton width={72} height={32} rounded="md" />
            <Skeleton width={72} height={32} rounded="md" />
          </div>
        </div>
      ))}
    </div>
  )
}

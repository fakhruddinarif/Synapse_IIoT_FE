import type { ReactNode } from 'react'
import { classNames } from '@/lib/utils'
import { EmptyState } from './EmptyState'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  /** Sembunyikan kolom di bawah breakpoint tertentu — kolom sekunder
   *  (deskripsi, timestamp) tidak boleh memaksa scroll horizontal di tablet. */
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl'
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  selectedKey?: string | null
  isLoading?: boolean
  emptyState?: ReactNode
  className?: string
}

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const hideMap = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
}

/**
 * Tabel berbasis definisi kolom, bukan JSX baris yang ditulis manual.
 *
 * Alasannya bukan keindahan: di kode lama, header skeleton dan header data
 * adalah dua blok `<thead>` terpisah yang harus dijaga selaras dengan tangan —
 * dan sudah tidak selaras (kolom "Device" di skeleton vs "Name" di tabel).
 * Dengan satu sumber kolom, keadaan memuat dan keadaan terisi tidak bisa lagi
 * berbeda.
 */
export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedKey,
  isLoading,
  emptyState,
  className,
}: TableProps<T>) {
  return (
    <div
      className={classNames(
        'overflow-x-auto rounded-card border border-gray-200 dark:border-gray-800',
        className,
      )}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={classNames(
                  'px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400',
                  alignMap[column.align ?? 'left'],
                  column.hideBelow && hideMap[column.hideBelow],
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading &&
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={classNames(
                      'px-4 py-3.5',
                      column.hideBelow && hideMap[column.hideBelow],
                    )}
                  >
                    <div className="h-3 rounded-pill bg-gray-200 dark:bg-gray-800" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length}>{emptyState ?? <EmptyState />}</td>
            </tr>
          )}

          {!isLoading &&
            data.map((row, index) => {
              const key = keyExtractor(row)
              const isSelected = selectedKey === key
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={classNames(
                    'transition-colors',
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-500/10'
                      : 'hover:bg-brand-50/60 dark:hover:bg-gray-800/50',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(
                        'px-4 py-3 text-sm text-gray-700 dark:text-gray-300',
                        alignMap[column.align ?? 'left'],
                        column.hideBelow && hideMap[column.hideBelow],
                      )}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import { Button } from './Button'
import { classNames } from '@/lib/utils'
import type { Paging } from '@/types/api'

interface PaginationProps {
  paging: Paging | null
  onPageChange: (page: number) => void
  loading?: boolean
}

const WINDOW_SIZE = 3

/**
 * Jendela nomor halaman, maksimal tiga, dimulai dari halaman aktif — di halaman
 * 4 dari 10 menampilkan [4,5,6]. Saat mendekati akhir, jendelanya bergeser ke
 * belakang supaya tetap menampilkan tiga nomor yang berujung di halaman
 * terakhir, mis. di halaman 9 dari 10 menampilkan [8,9,10].
 */
function getPageWindow(current: number, total: number, size = WINDOW_SIZE): number[] {
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1)

  let start = current
  let end = current + size - 1
  if (end > total) {
    end = total
    start = end - size + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({ paging, onPageChange, loading }: PaginationProps) {
  const { t } = useTranslation()

  if (!paging || paging.totalItem === 0) return null

  const from = (paging.page - 1) * paging.size + 1
  const to = Math.min(paging.page * paging.size, paging.totalItem)
  const pageWindow = getPageWindow(paging.page, paging.totalPage)
  const lastPage = paging.totalPage
  const hasGapToLast = lastPage > pageWindow[pageWindow.length - 1]

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t('common.showingResults', { from, to, total: paging.totalItem })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RiArrowLeftSLine size={16} />}
          disabled={loading || paging.page <= 1}
          onClick={() => onPageChange(paging.page - 1)}
        >
          <span className="hidden sm:inline">{t('common.previous')}</span>
        </Button>

        <nav
          aria-label={t('common.pageOf', { page: paging.page, totalPages: paging.totalPage })}
          className="flex items-center gap-1"
        >
          {pageWindow.map((page) => (
            <button
              key={page}
              type="button"
              disabled={loading}
              aria-current={page === paging.page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={classNames(
                'flex h-8 w-8 items-center justify-center rounded-button text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                page === paging.page
                  ? 'bg-brand-500 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
              )}
            >
              {page}
            </button>
          ))}

          {hasGapToLast && (
            <>
              <span className="flex h-8 w-8 items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                &hellip;
              </span>
              <button
                type="button"
                disabled={loading}
                onClick={() => onPageChange(lastPage)}
                className="flex h-8 w-8 items-center justify-center rounded-button border border-gray-300 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {lastPage}
              </button>
            </>
          )}
        </nav>

        <Button
          variant="secondary"
          size="sm"
          rightIcon={<RiArrowRightSLine size={16} />}
          disabled={loading || paging.page >= paging.totalPage}
          onClick={() => onPageChange(paging.page + 1)}
        >
          <span className="hidden sm:inline">{t('common.next')}</span>
        </Button>
      </div>
    </div>
  )
}

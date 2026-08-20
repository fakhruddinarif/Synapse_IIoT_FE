import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RiArrowRightSLine } from '@remixicon/react'
import { findMenuTrail, menuItems } from '@/config/menu'

interface Crumb {
  label: string
  url?: string
}

/**
 * Jejak dibangun dari `menu.ts`, bukan dari segmen path mentah, supaya setiap
 * crumb membawa kunci i18n yang sungguhan — dengan segmen mentah, breadcrumb
 * akan menampilkan "storage-flows" alih-alih "Storage Flow" dan tidak pernah
 * ikut berganti bahasa. Segmen di bawah entri menu terdalam (mis. id perangkat
 * pada halaman detail) ditambahkan apa adanya.
 */
function useCrumbs(pathname: string): Crumb[] {
  const { t } = useTranslation()

  const trail = findMenuTrail(menuItems, pathname)
  const crumbs: Crumb[] = [{ label: t('nav.dashboard'), url: '/' }]

  if (pathname === '/') return crumbs

  for (const item of trail) {
    crumbs.push({ label: t(item.label), url: item.url })
  }

  const deepestUrl = trail.at(-1)?.url ?? ''
  const rest = pathname
    .slice(deepestUrl === '/' ? 0 : deepestUrl.length)
    .split('/')
    .filter(Boolean)

  for (const segment of rest) {
    const decoded = decodeURIComponent(segment)
    crumbs.push({ label: humanize(decoded) })
  }

  return crumbs
}

function humanize(segment: string): string {
  return segment.replace(/[-_]+/g, ' ').replace(/\b\p{Ll}/gu, (char) => char.toUpperCase())
}

export function Breadcrumb({ pathname }: { pathname: string }) {
  const crumbs = useCrumbs(pathname)
  const last = crumbs[crumbs.length - 1]
  const leading = crumbs.slice(0, -1)

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
      {/* Crumb di depan adalah konteks, bukan judulnya — dilepas di layar kecil
          supaya judul halaman tidak ikut terpotong. */}
      {leading.map((crumb) => (
        <Fragment key={crumb.url ?? crumb.label}>
          {crumb.url ? (
            <Link
              to={crumb.url}
              className="hidden shrink-0 text-sm text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-200 sm:inline"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="hidden shrink-0 text-sm text-gray-500 dark:text-gray-400 sm:inline">
              {crumb.label}
            </span>
          )}
          <RiArrowRightSLine
            size={16}
            className="hidden shrink-0 text-gray-300 dark:text-gray-600 sm:inline"
          />
        </Fragment>
      ))}
      <span className="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
        {last.label}
      </span>
    </nav>
  )
}

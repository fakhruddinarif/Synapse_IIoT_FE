import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Aksi utama halaman — satu tombol, di kanan. Kalau sebuah halaman terasa
   *  butuh tiga tombol di sini, biasanya yang dibutuhkan adalah menu, bukan
   *  header yang lebih lebar. */
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

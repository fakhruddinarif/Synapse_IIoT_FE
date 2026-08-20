import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth.store'
import { useSessionCheck } from '@/hooks/useSessionCheck'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { UserRole } from '@/types/user'

/**
 * Menjalankan ulang verifikasi `/auth/info` setiap kali halaman terproteksi
 * dibuka. Profil tersimpan hanya berarti "pernah login", bukan "cookie masih
 * berlaku di gateway" — bisa saja kedaluwarsa (umur token satu jam), akunnya
 * dinonaktifkan, atau gatewaynya di-restart dengan JWT secret baru.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { t } = useTranslation()
  const { checking, isAuthenticated } = useSessionCheck()

  if (checking) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-chrome-content">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.sessionChecking')}</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Bawa tujuan awalnya supaya setelah login operator mendarat di sana, bukan
    // dilempar ke dasbor dan harus mengklik ulang.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode
  allowedRoles: UserRole[]
}) {
  const { t } = useTranslation()
  const role = useAuthStore((s) => s.user?.role)

  // Ditolak di tempat, bukan dialihkan ke dasbor: kalau tautannya dibagikan
  // rekan yang punya hak lebih, pengalihan diam-diam terlihat seperti tautan
  // rusak. Pesan eksplisit memberi tahu bahwa halamannya ada, izinnya yang tidak.
  if (!role || !allowedRoles.includes(role)) {
    return <EmptyState title={t('errors.forbidden')} />
  }

  return <>{children}</>
}

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { fetchProfile } from '@/services/auth.service'
import { isUnauthorized } from '@/lib/apiError'

/**
 * Karena sesi Synapse bersandar pada cookie HTTP-only, FE tidak punya cara
 * memeriksa sendiri apakah sesinya masih hidup — tidak ada token yang bisa
 * dibaca, apalagi diperiksa masa berlakunya. Satu-satunya jawaban otoritatif
 * adalah `GET /auth/info`.
 *
 * Karena itu hook ini selalu memanggilnya, bahkan saat store masih kosong:
 * cookie bisa saja ada (tab baru setelah login di tab lain, atau localStorage
 * dibersihkan) sementara profil lokal tidak. Menganggap "tidak ada profil" =
 * "tidak ada sesi" akan melempar operator ke halaman login walau sesinya sah.
 */
export function useSessionCheck() {
  const user = useAuthStore((s) => s.user)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    setChecking(true)

    fetchProfile()
      .then((profile) => {
        if (cancelled) return
        setSession(profile)
        setChecking(false)
      })
      .catch((error) => {
        if (cancelled) return
        // Hanya 401 yang berarti sesinya sungguh tidak valid. Gateway sedang
        // restart atau jaringan pabrik berkedip tidak boleh ikut memaksa
        // logout — itu membuang sesi yang sebenarnya masih sah.
        if (isUnauthorized(error)) clearSession()
        setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [setSession, clearSession])

  return { checking, isAuthenticated: !!user }
}

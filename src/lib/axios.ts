import axios from 'axios'
import { API_URL } from '@/config/env'
import { useAuthStore } from '@/store/auth.store'

/**
 * Sesi Synapse memakai cookie HTTP-only (`JWT-TOKEN`, dipasang
 * `AuthController.Login`) — BUKAN Bearer token di localStorage. Karena itu:
 *
 *  - `withCredentials: true` wajib di setiap request, kalau tidak cookienya
 *    tidak pernah ikut terkirim dan semua endpoint `[Authorize]` menjawab 401;
 *  - tidak ada interceptor yang menempelkan header Authorization — tidak ada
 *    token yang bisa dibaca JavaScript, dan itu justru tujuan cookie HTTP-only;
 *  - store hanya menyimpan profil user untuk keperluan tampilan. Kebenaran
 *    sesi selalu ditanyakan ke `GET /auth/info`.
 *
 * Konsekuensinya backend harus mengizinkan origin FE secara eksplisit
 * (`AllowCredentials` tidak bisa dipadukan dengan wildcard origin) — daftarnya
 * ada di policy `AllowFrontend` pada Api/Program.cs.
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie sudah kedaluwarsa atau dibuang server. Bersihkan profil lokal
      // supaya sidebar dan header tidak menampilkan user yang sesungguhnya
      // sudah tidak punya sesi.
      useAuthStore.getState().clearSession()
      const { pathname } = window.location
      if (pathname !== '/login' && pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api

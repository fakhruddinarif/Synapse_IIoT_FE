import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, UserRole } from '@/types/user'
import { canDelete, canWrite } from '@/types/user'

interface AuthState {
  user: AuthUser | null
  /** Hanya berarti "ada profil tersimpan dari sesi sebelumnya". Bukti sesi
   *  masih hidup adalah cookie `JWT-TOKEN` yang tak terbaca JS, jadi
   *  `useSessionCheck` yang memastikannya lewat `GET /auth/info`. */
  isAuthenticated: boolean
  setSession: (user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user) => set({ user, isAuthenticated: true }),
      clearSession: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'synapse-auth',
      // Token tidak pernah dipersist karena tidak pernah dipegang FE. Yang
      // disimpan hanya profil, supaya chrome (sidebar/header) bisa tampil utuh
      // pada frame pertama sebelum `/auth/info` menjawab.
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user
        }
      },
    },
  ),
)

export function useRole(): UserRole | null {
  return useAuthStore((s) => s.user?.role ?? null)
}

export function useIsAdmin(): boolean {
  return useAuthStore((s) => s.user?.role === 'ADMIN')
}

/** Boleh mengubah konfigurasi gateway (device, tag, tabel, storage flow). */
export function useCanWrite(): boolean {
  return useAuthStore((s) => canWrite(s.user?.role))
}

export function useCanDelete(): boolean {
  return useAuthStore((s) => canDelete(s.user?.role))
}

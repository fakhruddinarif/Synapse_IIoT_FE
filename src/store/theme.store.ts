import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

function systemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  // Memberi tahu browser cara mewarnai chrome-nya sendiri (scrollbar, form
  // control bawaan) — tanpa ini scrollbar tetap terang di mode gelap.
  document.documentElement.style.colorScheme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Kunjungan pertama mengikuti preferensi OS; setelah pengguna memilih
      // sendiri, pilihannya yang menang dan tidak lagi berubah saat OS berubah.
      theme: systemTheme(),
      toggle: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        applyTheme(next)
        set({ theme: next })
      },
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'synapse-theme',
      // Tanpa ini kelas `.dark` hanya terpasang saat tombol ditekan, sehingga
      // setelah reload latar kembali terang walau tema tersimpan gelap.
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? systemTheme())
      },
    },
  ),
)

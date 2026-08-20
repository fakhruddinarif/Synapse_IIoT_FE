import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'

export type Lang = 'id' | 'en'

interface LanguageState {
  lang: Lang
  toggle: () => void
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: (i18n.language?.startsWith('en') ? 'en' : 'id') as Lang,
      toggle: () => {
        const next = get().lang === 'id' ? 'en' : 'id'
        void i18n.changeLanguage(next)
        set({ lang: next })
      },
      setLang: (lang) => {
        void i18n.changeLanguage(lang)
        set({ lang })
      },
    }),
    {
      name: 'synapse-lang',
      // i18next punya deteksi + cache localStorage sendiri, tapi store ini yang
      // dibaca komponen. Menyelaraskannya saat rehydrate mencegah keduanya
      // berbeda pendapat setelah reload (bendera menunjukkan ID, teksnya EN).
      onRehydrateStorage: () => (state) => {
        if (state?.lang && i18n.language !== state.lang) {
          void i18n.changeLanguage(state.lang)
        }
      },
    },
  ),
)

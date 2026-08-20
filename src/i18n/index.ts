import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import id from './locales/id.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
    },
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // localStorage lebih dulu daripada bahasa browser: operator di ruang
      // kontrol sering memakai mesin bersama dengan locale OS yang tidak bisa
      // ia ubah, sementara pilihannya sendiri harus bertahan antar giliran.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { appTitle } from '@/config/app'

/**
 * Menjaga judul tab dan `<html lang>` selaras dengan bahasa aktif. Nama produk
 * adalah nama diri dan tidak diterjemahkan — hanya subjudulnya yang ikut
 * berganti bahasa.
 */
export function useDocumentTitle() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = `${appTitle} — ${t('app.subtitle')}`
    document.documentElement.lang = i18n.language
  }, [t, i18n.language])
}

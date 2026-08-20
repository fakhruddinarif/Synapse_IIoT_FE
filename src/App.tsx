import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/router'
import { useThemeStore } from '@/store/theme.store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Spinner } from '@/components/ui/Spinner'

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  useDocumentTitle()

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-chrome-content">
          <Spinner size="lg" />
        </div>
      }
    >
      <RouterProvider router={router} />
      {/* Tema diteruskan eksplisit ke sonner: ia merender portalnya di luar
          pohon aplikasi, jadi kelas `.dark` di <html> tidak cukup untuk membuat
          toast-nya ikut gelap. */}
      <Toaster theme={theme} position="top-right" richColors closeButton />
    </Suspense>
  )
}

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RiCompass3Line } from '@remixicon/react'
import { Button } from '@/components/ui/Button'
import { AuroraBackdrop } from '@/components/layout/AuroraBackdrop'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-chrome-content px-4 text-center">
      <AuroraBackdrop variant="auth" />
      <div className="relative z-10 flex flex-col items-center">
        <RiCompass3Line size={56} className="text-brand-400" />
        <p className="mt-6 text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
          404
        </p>
        <h1 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t('notFound.title')}
        </h1>
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {t('notFound.body')}
        </p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          {t('notFound.back')}
        </Button>
      </div>
    </div>
  )
}

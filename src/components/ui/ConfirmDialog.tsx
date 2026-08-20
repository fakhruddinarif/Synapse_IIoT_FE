import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: ReactNode
  confirmLabel?: string
  loading?: boolean
  danger?: boolean
}

/**
 * Menggantikan `window.confirm()` yang tersebar di kode lama. Selain
 * penampilannya, bedanya penting: `confirm()` memblokir seluruh thread UI, jadi
 * grafik realtime berhenti bergerak dan data yang masuk selama dialog terbuka
 * menumpuk — di aplikasi SCADA itu artinya operator melihat data basi tepat
 * ketika ia sedang mengambil keputusan.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  loading,
  danger,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={loading}
          >
            {confirmLabel ?? t('common.confirm')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </Modal>
  )
}

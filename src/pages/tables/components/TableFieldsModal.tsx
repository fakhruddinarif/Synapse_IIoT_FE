import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { RiAddLine, RiDeleteBinLine } from '@remixicon/react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Spinner } from '@/components/ui/Spinner'
import * as masterTableService from '@/services/master-table.service'
import { resolveApiError } from '@/lib/apiError'
import {
  FIELD_DATA_TYPES,
  FIELD_DATA_TYPE_LABELS,
  type FieldDataType,
  type MasterTable,
  type MasterTableField,
} from '@/types/master-table'

interface TableFieldsModalProps {
  open: boolean
  onClose: () => void
  table: MasterTable | null
  /** Dipanggil setelah kolom berubah — daftar tabel menampilkan jumlah kolom,
   *  jadi ia harus dimuat ulang. */
  onChanged: () => void
}

/**
 * Kolom dikelola di dialognya sendiri, bukan di form tabel, karena setiap
 * perubahan di sini adalah satu request yang langsung mengubah struktur tabel
 * fisik di database — tidak ada tombol "Simpan" yang bisa dibatalkan. Membaurkan
 * keduanya dalam satu form akan membuat sebagian perubahan tersimpan dan
 * sebagian tidak ketika operator menekan Batal.
 */
export function TableFieldsModal({ open, onClose, table, onChanged }: TableFieldsModalProps) {
  const { t } = useTranslation()

  const [fields, setFields] = useState<MasterTableField[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<{ name: string; dataType: FieldDataType; isEnabled: boolean }>(
    { name: '', dataType: 'STRING', isEnabled: true },
  )
  const [deleteTarget, setDeleteTarget] = useState<MasterTableField | null>(null)

  useEffect(() => {
    if (!open || !table) return

    // Kolom dimuat ulang dari server, bukan diambil dari objek tabel di daftar:
    // daftar itu bisa saja sudah basi (kolom ditambah dari sesi lain), dan
    // dialog ini justru tempat perubahan kolom terjadi.
    let cancelled = false
    setLoading(true)
    setAdding(false)
    setDraft({ name: '', dataType: 'STRING', isEnabled: true })

    masterTableService
      .fetchFields(table.id)
      .then((result) => {
        if (!cancelled) setFields(result)
      })
      .catch((error) => {
        if (!cancelled) toast.error(resolveApiError(error, t('errors.loadFailed')))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, table, t])

  async function handleAdd() {
    if (!table || !draft.name.trim()) return
    setBusyId('new')
    try {
      const created = await masterTableService.createField(table.id, {
        ...draft,
        name: draft.name.trim(),
      })
      setFields((previous) => [...previous, created])
      setDraft({ name: '', dataType: 'STRING', isEnabled: true })
      setAdding(false)
      toast.success(t('tables.fieldCreated'))
      onChanged()
    } catch (error) {
      toast.error(resolveApiError(error, t('errors.saveFailed')))
    } finally {
      setBusyId(null)
    }
  }

  async function handleToggle(field: MasterTableField) {
    if (!table) return
    setBusyId(field.id)
    try {
      const updated = await masterTableService.updateField(table.id, field.id, {
        isEnabled: !field.isEnabled,
      })
      setFields((previous) => previous.map((item) => (item.id === field.id ? updated : item)))
      onChanged()
    } catch (error) {
      toast.error(resolveApiError(error, t('errors.saveFailed')))
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete() {
    if (!table || !deleteTarget) return
    setBusyId(deleteTarget.id)
    try {
      await masterTableService.deleteField(table.id, deleteTarget.id)
      setFields((previous) => previous.filter((item) => item.id !== deleteTarget.id))
      toast.success(t('tables.fieldDeleted'))
      setDeleteTarget(null)
      onChanged()
    } catch (error) {
      toast.error(resolveApiError(error, t('errors.deleteFailed')))
    } finally {
      setBusyId(null)
    }
  }

  if (!table) return null

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="lg"
        title={t('tables.manageFields')}
        description={`${table.name} · ${table.tableName}`}
        footer={
          <Button variant="secondary" onClick={onClose}>
            {t('common.close')}
          </Button>
        }
      >
        <div className="space-y-4">
          {!adding && (
            <Button
              variant="subtle"
              size="sm"
              leftIcon={<RiAddLine size={14} />}
              onClick={() => setAdding(true)}
            >
              {t('tables.addField')}
            </Button>
          )}

          {adding && (
            <div className="rounded-card border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
              <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <Input
                    isFullWidth
                    mono
                    autoFocus
                    label={t('tables.fieldName')}
                    placeholder={t('tables.fieldNamePlaceholder')}
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Select
                    isFullWidth
                    label={t('tables.fieldType')}
                    value={draft.dataType}
                    onChange={(event) =>
                      setDraft({ ...draft, dataType: event.target.value as FieldDataType })
                    }
                    options={FIELD_DATA_TYPES.map((type) => ({
                      value: type,
                      label: FIELD_DATA_TYPE_LABELS[type],
                    }))}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Checkbox
                    label={<span className="text-xs">{t('common.active')}</span>}
                    checked={draft.isEnabled}
                    onChange={(event) => setDraft({ ...draft, isEnabled: event.target.checked })}
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setAdding(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => void handleAdd()}
                  isLoading={busyId === 'new'}
                  disabled={!draft.name.trim()}
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}

          {!loading && fields.length === 0 && (
            <EmptyState
              compact
              title={t('tables.noFields')}
              description={t('tables.noFieldsHint')}
            />
          )}

          {!loading && fields.length > 0 && (
            <ul className="divide-y divide-gray-100 rounded-card border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {fields.map((field) => (
                <li key={field.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-gray-900 dark:text-white">
                      {field.name}
                    </p>
                  </div>
                  <Badge variant="accent">{FIELD_DATA_TYPE_LABELS[field.dataType]}</Badge>
                  {/* Tombol, bukan badge pasif: mengaktifkan/menonaktifkan kolom
                      adalah aksi yang paling sering dilakukan di dialog ini. */}
                  <button
                    type="button"
                    disabled={busyId === field.id}
                    onClick={() => void handleToggle(field)}
                    className="shrink-0 disabled:opacity-50"
                  >
                    <Badge dot variant={field.isEnabled ? 'success' : 'neutral'}>
                      {field.isEnabled ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('common.delete')}
                    disabled={busyId === field.id}
                    className="text-error-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                    onClick={() => setDeleteTarget(field)}
                  >
                    <RiDeleteBinLine size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={t('tables.fieldDeleteTitle')}
        description={t('tables.fieldDeleteBody', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        loading={busyId === deleteTarget?.id}
        danger
      />
    </>
  )
}

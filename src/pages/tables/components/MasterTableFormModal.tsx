import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { RiAddLine, RiDeleteBinLine, RiInformationLine } from '@remixicon/react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Checkbox } from '@/components/ui/Checkbox'
import * as masterTableService from '@/services/master-table.service'
import { resolveApiError } from '@/lib/apiError'
import {
  FIELD_DATA_TYPES,
  FIELD_DATA_TYPE_LABELS,
  isValidTableName,
  toTableName,
  type CreateMasterTableFieldRequest,
  type MasterTable,
} from '@/types/master-table'

interface MasterTableFormModalProps {
  open: boolean
  onClose: () => void
  table: MasterTable | null
  onSaved: () => void
}

interface DraftField extends CreateMasterTableFieldRequest {
  /** Kunci lokal untuk React. Tidak dikirim ke backend. Memakai indeks sebagai
   *  key membuat baris yang dihapus di tengah menyalin nilai baris berikutnya. */
  key: string
}

function newField(): DraftField {
  return {
    key: crypto.randomUUID(),
    name: '',
    dataType: 'STRING',
    isEnabled: true,
  }
}

export function MasterTableFormModal({
  open,
  onClose,
  table,
  onSaved,
}: MasterTableFormModalProps) {
  const { t } = useTranslation()
  const isEdit = Boolean(table)

  const [name, setName] = useState('')
  const [tableName, setTableName] = useState('')
  const [tableNameTouched, setTableNameTouched] = useState(false)
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [fields, setFields] = useState<DraftField[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setTableNameTouched(Boolean(table))

    if (table) {
      setName(table.name)
      setTableName(table.tableName)
      setDescription(table.description ?? '')
      setIsActive(table.isActive)
      setFields([])
      return
    }

    setName('')
    setTableName('')
    setDescription('')
    setIsActive(false)
    setFields([newField()])
  }, [open, table])

  /**
   * Nama fisik disarankan dari nama tampilan sampai operator mengubahnya
   * sendiri. Setelah itu saran berhenti — nama fisik adalah identitas tabel di
   * database, dan menimpanya diam-diam saat label diperbaiki akan mengarahkan
   * tabel ke nama yang berbeda dari yang sudah dibuat.
   */
  function handleNameChange(value: string) {
    setName(value)
    if (!isEdit && !tableNameTouched) setTableName(toTableName(value))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t('tables.nameRequired')
    if (!tableName.trim()) next.tableName = t('tables.tableNameRequired')
    else if (!isValidTableName(tableName.trim())) next.tableName = t('tables.tableNameInvalid')
    if (!isEdit) {
      const named = fields.filter((field) => field.name.trim())
      if (named.length !== fields.length) next.fields = t('tables.fieldNameRequired')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    try {
      if (table) {
        // `fields` sengaja TIDAK dikirim: `UpdateMasterTableDto` tidak
        // memilikinya, dan menyertakannya hanya menciptakan ilusi bahwa kolom
        // bisa diubah dari sini.
        await masterTableService.updateMasterTable(table.id, {
          name: name.trim(),
          tableName: tableName.trim(),
          description: description.trim() || undefined,
          isActive,
        })
        toast.success(t('tables.updated'))
      } else {
        await masterTableService.createMasterTable({
          name: name.trim(),
          tableName: tableName.trim(),
          description: description.trim() || undefined,
          isActive,
          fields: fields.map(({ key: _key, ...field }) => ({
            ...field,
            name: field.name.trim(),
          })),
        })
        toast.success(t('tables.created'))
      }
      onSaved()
      onClose()
    } catch (error) {
      setErrors({ root: resolveApiError(error, t('errors.saveFailed')) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? t('tables.edit') : t('tables.add')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void handleSubmit()} isLoading={submitting}>
            {isEdit ? t('common.update') : t('common.create')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {errors.root && (
          <p
            role="alert"
            className="rounded-card bg-error-50 px-3.5 py-2.5 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400"
          >
            {errors.root}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            isFullWidth
            label={t('tables.name')}
            placeholder={t('tables.namePlaceholder')}
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={errors.name}
            required
          />
          <Input
            isFullWidth
            mono
            label={t('tables.tableName')}
            hint={t('tables.tableNameHint')}
            placeholder="production_temperature_log"
            value={tableName}
            onChange={(event) => {
              setTableNameTouched(true)
              setTableName(event.target.value)
            }}
            error={errors.tableName}
            required
          />
        </div>

        <Textarea
          isFullWidth
          rows={2}
          label={t('common.description')}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <Switch
          checked={isActive}
          onChange={setIsActive}
          label={t('tables.activate')}
          description={t('tables.activateHint')}
        />

        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          {isEdit ? (
            <div className="flex items-start gap-2.5 rounded-card bg-brand-50 px-3.5 py-3 dark:bg-brand-500/10">
              <RiInformationLine
                size={18}
                className="mt-px shrink-0 text-brand-500 dark:text-brand-300"
              />
              <p className="text-xs text-brand-700 dark:text-brand-200">
                {t('tables.fieldsEditHint')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t('tables.fields')}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {t('tables.fieldsOnCreateHint')}
                  </p>
                </div>
                <Button
                  variant="subtle"
                  size="sm"
                  leftIcon={<RiAddLine size={14} />}
                  onClick={() => setFields((previous) => [...previous, newField()])}
                >
                  {t('tables.addField')}
                </Button>
              </div>

              {errors.fields && (
                <p className="mt-2 text-xs text-error-500">{errors.fields}</p>
              )}

              {fields.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {t('tables.noFieldsHint')}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {fields.map((field, index) => (
                    <li
                      key={field.key}
                      className="grid grid-cols-1 items-end gap-3 rounded-card border border-gray-200 p-3 sm:grid-cols-12 dark:border-gray-800"
                    >
                      <div className="sm:col-span-5">
                        <Input
                          isFullWidth
                          mono
                          placeholder={t('tables.fieldNamePlaceholder')}
                          value={field.name}
                          onChange={(event) =>
                            setFields((previous) =>
                              previous.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, name: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <Select
                          isFullWidth
                          value={field.dataType}
                          onChange={(event) =>
                            setFields((previous) =>
                              previous.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      dataType: event.target
                                        .value as CreateMasterTableFieldRequest['dataType'],
                                    }
                                  : item,
                              ),
                            )
                          }
                          options={FIELD_DATA_TYPES.map((type) => ({
                            value: type,
                            label: FIELD_DATA_TYPE_LABELS[type],
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:col-span-3">
                        <Checkbox
                          label={<span className="text-xs">{t('common.active')}</span>}
                          checked={field.isEnabled}
                          onChange={(event) =>
                            setFields((previous) =>
                              previous.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, isEnabled: event.target.checked }
                                  : item,
                              ),
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('common.delete')}
                          className="text-error-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                          onClick={() =>
                            setFields((previous) =>
                              previous.filter((item) => item.key !== field.key),
                            )
                          }
                        >
                          <RiDeleteBinLine size={16} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

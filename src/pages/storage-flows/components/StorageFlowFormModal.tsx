import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RiAddLine,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiInformationLine,
  RiRadarLine,
} from '@remixicon/react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Checkbox } from '@/components/ui/Checkbox'
import { RequiredMark } from '@/components/ui/RequiredMark'
import * as storageFlowService from '@/services/storage-flow.service'
import { resolveApiError } from '@/lib/apiError'
import { FIELD_DATA_TYPE_LABELS, type MasterTable } from '@/types/master-table'
import type { Device } from '@/types/device'
import type { DiscoveredField, StorageFlow } from '@/types/storage-flow'

interface StorageFlowFormModalProps {
  open: boolean
  onClose: () => void
  flow: StorageFlow | null
  devices: Device[]
  tables: MasterTable[]
  onSaved: () => void
}

interface DraftMapping {
  key: string
  masterTableFieldId: string
  sourcePath: string
}

function newMapping(): DraftMapping {
  return { key: crypto.randomUUID(), masterTableFieldId: '', sourcePath: '' }
}

export function StorageFlowFormModal({
  open,
  onClose,
  flow,
  devices,
  tables,
  onSaved,
}: StorageFlowFormModalProps) {
  const { t } = useTranslation()
  const isEdit = Boolean(flow)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [storageInterval, setStorageInterval] = useState(10000)
  const [isActive, setIsActive] = useState(true)
  const [deviceIds, setDeviceIds] = useState<string[]>([])
  const [masterTableId, setMasterTableId] = useState('')
  const [mappings, setMappings] = useState<DraftMapping[]>([])
  const [discovered, setDiscovered] = useState<DiscoveredField[]>([])
  const [discovering, setDiscovering] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setDiscovered([])

    if (flow) {
      setName(flow.name)
      setDescription(flow.description ?? '')
      setStorageInterval(flow.storageInterval)
      setIsActive(flow.isActive)
      setDeviceIds(flow.devices.map((device) => device.deviceId))
      setMasterTableId(flow.masterTableId)
      setMappings(
        flow.mappings.map((mapping) => ({
          key: mapping.id || crypto.randomUUID(),
          masterTableFieldId: mapping.masterTableFieldId,
          sourcePath: mapping.sourcePath,
        })),
      )
      return
    }

    setName('')
    setDescription('')
    setStorageInterval(10000)
    setIsActive(true)
    setDeviceIds([])
    setMasterTableId('')
    setMappings([])
  }, [open, flow])

  /**
   * Kolom diambil dari daftar tabel yang sudah dimuat halaman —
   * `GET /master-tables` sudah menyertakan `fields`, jadi memanggil endpoint
   * detail lagi di sini hanya menambah satu request tanpa informasi baru.
   */
  const selectedTable = useMemo(
    () => tables.find((table) => table.id === masterTableId) ?? null,
    [tables, masterTableId],
  )

  // Hanya kolom aktif yang boleh menjadi tujuan: kolom nonaktif tetap ada di
  // tabel fisik tapi tidak diisi worker, jadi memetakannya menghasilkan flow
  // yang tampak benar namun tidak pernah menulis apa pun ke sana.
  const enabledFields = useMemo(
    () => selectedTable?.fields.filter((field) => field.isEnabled) ?? [],
    [selectedTable],
  )

  // Berganti tabel tujuan membuat seluruh masterTableFieldId lama menunjuk ke
  // kolom milik tabel lain. Path sumbernya masih berguna, jadi yang dibuang
  // hanya kolom tujuannya.
  function handleTableChange(nextId: string) {
    setMasterTableId(nextId)
    if (nextId !== masterTableId) {
      setMappings((previous) => previous.map((item) => ({ ...item, masterTableFieldId: '' })))
    }
  }

  function toggleDevice(deviceId: string) {
    setDeviceIds((previous) =>
      previous.includes(deviceId)
        ? previous.filter((item) => item !== deviceId)
        : [...previous, deviceId],
    )
  }

  /** Membaca path yang tersedia dari data terakhir perangkat pertama yang
   *  dipilih — sekadar bantuan pengisian, bukan syarat. */
  async function handleDiscover() {
    const deviceId = deviceIds[0]
    if (!deviceId) return

    setDiscovering(true)
    try {
      const fields = await storageFlowService.discoverFields(deviceId)
      setDiscovered(fields)
      if (fields.length === 0) {
        toast.info(t('flows.discoverEmpty'))
      } else {
        toast.success(t('flows.discovered', { count: fields.length }))
      }
    } catch (error) {
      toast.error(resolveApiError(error, t('flows.discoverFailed')))
    } finally {
      setDiscovering(false)
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t('flows.nameRequired')
    if (deviceIds.length === 0) next.devices = t('flows.deviceRequired')
    if (!masterTableId) next.table = t('flows.tableRequired')
    if (mappings.length === 0) next.mappings = t('flows.mappingRequired')
    else if (
      mappings.some((mapping) => !mapping.sourcePath.trim() || !mapping.masterTableFieldId)
    ) {
      next.mappings = t('flows.mappingIncomplete')
    } else {
      // Dua mapping ke kolom yang sama berarti nilai kedua menimpa yang pertama
      // pada setiap penulisan — backend menerimanya, dan datanya diam-diam
      // kehilangan salah satu sumber.
      const targets = mappings.map((mapping) => mapping.masterTableFieldId)
      if (new Set(targets).size !== targets.length) {
        next.mappings = t('flows.mappingDuplicate')
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        isActive,
        storageInterval,
        masterTableId,
        deviceIds,
        mappings: mappings.map((mapping) => ({
          masterTableFieldId: mapping.masterTableFieldId,
          sourcePath: mapping.sourcePath.trim(),
        })),
      }

      if (flow) {
        await storageFlowService.updateStorageFlow(flow.id, payload)
        toast.success(t('flows.updated'))
      } else {
        await storageFlowService.createStorageFlow(payload)
        toast.success(t('flows.created'))
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
      size="xl"
      title={isEdit ? t('flows.edit') : t('flows.add')}
      description={t('flows.subtitle')}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Input
              isFullWidth
              label={t('flows.name')}
              placeholder={t('flows.namePlaceholder')}
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={errors.name}
              required
            />
          </div>
          <Input
            isFullWidth
            type="number"
            min={100}
            step={100}
            label={t('flows.interval')}
            hint={t('flows.intervalHint')}
            value={storageInterval}
            onChange={(event) => setStorageInterval(Number(event.target.value))}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* ------------------------- perangkat sumber ---------------------- */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('flows.devices')}
              <RequiredMark />
            </p>
            <div className="max-h-44 overflow-y-auto rounded-input border border-gray-300 p-2 dark:border-gray-700">
              {devices.length === 0 ? (
                <p className="px-1 py-2 text-xs text-gray-500 dark:text-gray-400">
                  {t('flows.devicesEmpty')}
                </p>
              ) : (
                <ul className="space-y-1">
                  {devices.map((device) => (
                    <li key={device.id} className="rounded-button px-1 py-1">
                      <Checkbox
                        label={<span className="text-sm">{device.name}</span>}
                        checked={deviceIds.includes(device.id)}
                        onChange={() => toggleDevice(device.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {deviceIds.length > 0
                ? t('flows.devicesSelected', { count: deviceIds.length })
                : t('flows.devicesHint')}
            </p>
            {errors.devices && <p className="mt-1 text-xs text-error-500">{errors.devices}</p>}
          </div>

          {/* -------------------------- tabel tujuan ------------------------- */}
          <div className="space-y-4">
            <Select
              isFullWidth
              label={t('flows.table')}
              placeholder={t('flows.selectTable')}
              value={masterTableId}
              onChange={(event) => handleTableChange(event.target.value)}
              error={errors.table}
              required
              options={tables.map((table) => ({
                value: table.id,
                label: `${table.name} (${table.tableName})`,
                // Tabel nonaktif tetap terlihat supaya flow lama yang menunjuk
                // ke sana tidak kehilangan konteks, tapi tidak bisa dipilih untuk
                // flow baru.
                disabled: !table.isActive && table.id !== flow?.masterTableId,
              }))}
            />

            <Switch
              checked={isActive}
              onChange={setIsActive}
              label={t('flows.activate')}
              description={t('flows.activateHint')}
            />
          </div>
        </div>

        {/* ---------------------------- pemetaan ---------------------------- */}
        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('flows.mappings')}
                <RequiredMark />
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {t('flows.mappingsHint')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RiRadarLine size={14} />}
                onClick={() => void handleDiscover()}
                isLoading={discovering}
                disabled={deviceIds.length === 0}
              >
                {discovering ? t('flows.discovering') : t('flows.discover')}
              </Button>
              <Button
                variant="subtle"
                size="sm"
                leftIcon={<RiAddLine size={14} />}
                disabled={!masterTableId}
                onClick={() => setMappings((previous) => [...previous, newMapping()])}
              >
                {t('flows.addMapping')}
              </Button>
            </div>
          </div>

          {!masterTableId && (
            <div className="mt-3 flex items-start gap-2.5 rounded-card bg-warning-50 px-3.5 py-3 dark:bg-warning-500/10">
              <RiInformationLine
                size={18}
                className="mt-px shrink-0 text-warning-500 dark:text-warning-400"
              />
              <p className="text-xs text-warning-600 dark:text-warning-400">
                {t('flows.needTable')}
              </p>
            </div>
          )}

          {masterTableId && enabledFields.length === 0 && (
            <p className="mt-3 rounded-card bg-error-50 px-3.5 py-3 text-xs text-error-600 dark:bg-error-500/10 dark:text-error-400">
              {t('flows.noEnabledFields')}
            </p>
          )}

          {errors.mappings && <p className="mt-2 text-xs text-error-500">{errors.mappings}</p>}

          {masterTableId && mappings.length === 0 && enabledFields.length > 0 && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t('flows.noMappings')}
            </p>
          )}

          {mappings.length > 0 && (
            <ul className="mt-3 space-y-2">
              {mappings.map((mapping, index) => (
                <li
                  key={mapping.key}
                  className="grid grid-cols-1 items-start gap-3 rounded-card border border-gray-200 p-3 md:grid-cols-12 dark:border-gray-800"
                >
                  <div className="md:col-span-5">
                    <Input
                      isFullWidth
                      mono
                      label={index === 0 ? t('flows.sourcePath') : undefined}
                      placeholder={t('flows.sourcePathPlaceholder')}
                      // `list` memanfaatkan datalist native: saran path muncul
                      // saat mengetik, tapi nilai di luar daftar tetap boleh —
                      // hasil deteksi hanyalah bantuan, bukan pembatas.
                      list={discovered.length > 0 ? 'discovered-paths' : undefined}
                      value={mapping.sourcePath}
                      onChange={(event) =>
                        setMappings((previous) =>
                          previous.map((item) =>
                            item.key === mapping.key
                              ? { ...item, sourcePath: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>

                  <div className="flex justify-center md:col-span-1 md:pt-8">
                    <RiArrowRightLine size={18} className="text-gray-400 dark:text-gray-600" />
                  </div>

                  <div className="md:col-span-5">
                    <Select
                      isFullWidth
                      label={index === 0 ? t('flows.targetField') : undefined}
                      placeholder={t('flows.selectField')}
                      value={mapping.masterTableFieldId}
                      disabled={enabledFields.length === 0}
                      onChange={(event) =>
                        setMappings((previous) =>
                          previous.map((item) =>
                            item.key === mapping.key
                              ? { ...item, masterTableFieldId: event.target.value }
                              : item,
                          ),
                        )
                      }
                      options={enabledFields.map((field) => ({
                        value: field.id,
                        label: `${field.name} · ${FIELD_DATA_TYPE_LABELS[field.dataType]}`,
                      }))}
                    />
                  </div>

                  <div className={`flex justify-end md:col-span-1 ${index === 0 ? 'md:pt-7' : ''}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.delete')}
                      className="text-error-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                      onClick={() =>
                        setMappings((previous) =>
                          previous.filter((item) => item.key !== mapping.key),
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

          {mappings.length > 0 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('flows.sourcePathHint')}
              {enabledFields.length > 0 && ` · ${t('flows.fieldsAvailable', { count: enabledFields.length })}`}
            </p>
          )}

          {/* Satu datalist untuk semua baris — daftarnya sama, dan menduplikasi
              per baris hanya menggandakan node DOM tanpa manfaat. */}
          {discovered.length > 0 && (
            <datalist id="discovered-paths">
              {discovered.map((field) => (
                <option key={field.path} value={field.path}>
                  {field.type}
                </option>
              ))}
            </datalist>
          )}
        </div>
      </div>
    </Modal>
  )
}

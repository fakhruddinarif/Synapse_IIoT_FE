import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RequiredMark } from '@/components/ui/RequiredMark'
import * as tagService from '@/services/tag.service'
import { resolveApiError } from '@/lib/apiError'
import type { Device } from '@/types/device'
import { ACCESS_MODES, TAG_DATA_TYPES, type Tag } from '@/types/tag'

interface TagFormModalProps {
  open: boolean
  onClose: () => void
  tag: Tag | null
  devices: Device[]
  /** Perangkat yang sedang difilter di halaman — jadi nilai awal saat membuat
   *  tag baru, karena itulah perangkat yang sedang dipikirkan operator. */
  defaultDeviceId?: string
  onSaved: () => void
}

export function TagFormModal({
  open,
  onClose,
  tag,
  devices,
  defaultDeviceId,
  onSaved,
}: TagFormModalProps) {
  const { t } = useTranslation()
  const isEdit = Boolean(tag)

  const schema = useMemo(
    () =>
      z
        .object({
          deviceId: z.string().min(1, t('tags.emptyPickDevice')),
          name: z.string().trim().min(3, t('tags.nameRequired')),
          address: z.string().trim().min(1, t('tags.addressRequired')),
          dataType: z.enum(TAG_DATA_TYPES),
          accessMode: z.enum(ACCESS_MODES),
          rawMin: z.number(),
          rawMax: z.number(),
          euMin: z.number(),
          euMax: z.number(),
          unit: z.string().trim().max(20).optional(),
          opcUaNodeId: z.string().trim().max(256).optional(),
        })
        // Rentang terbalik lolos validasi per-field tapi menghasilkan penskalaan
        // yang membalik arah nilai — suhu naik terbaca turun. Ditangkap di sini,
        // bukan setelah data tersimpan berjam-jam.
        .refine((values) => values.rawMax > values.rawMin, {
          message: t('tags.rangeInvalid'),
          path: ['rawMax'],
        })
        .refine((values) => values.euMax > values.euMin, {
          message: t('tags.rangeInvalid'),
          path: ['euMax'],
        }),
    [t],
  )

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deviceId: '',
      name: '',
      address: '',
      dataType: 'FLOAT',
      accessMode: 'READONLY',
      rawMin: 0,
      rawMax: 4095,
      euMin: 0,
      euMax: 100,
      unit: '',
      opcUaNodeId: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (tag) {
      reset({
        deviceId: tag.deviceId,
        name: tag.name,
        address: tag.address,
        dataType: tag.dataType,
        accessMode: tag.accessMode,
        rawMin: tag.rawMin,
        rawMax: tag.rawMax,
        euMin: tag.euMin,
        euMax: tag.euMax,
        unit: tag.unit ?? '',
        opcUaNodeId: tag.opcUaNodeId ?? '',
      })
      return
    }
    reset({
      deviceId: defaultDeviceId ?? '',
      name: '',
      address: '',
      dataType: 'FLOAT',
      accessMode: 'READONLY',
      rawMin: 0,
      rawMax: 4095,
      euMin: 0,
      euMax: 100,
      unit: '',
      opcUaNodeId: '',
    })
  }, [open, tag, defaultDeviceId, reset])

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        dataType: values.dataType,
        accessMode: values.accessMode,
        rawMin: values.rawMin,
        rawMax: values.rawMax,
        euMin: values.euMin,
        euMax: values.euMax,
        unit: values.unit?.trim() || undefined,
        opcUaNodeId: values.opcUaNodeId?.trim() || undefined,
      }

      if (tag) {
        // `deviceId` tidak dikirim saat update: `UpdateTagDto` tidak memilikinya.
        // Memindahkan tag ke perangkat lain berarti alamatnya harus ditafsirkan
        // ulang, dan itu tag baru — bukan pengubahan.
        await tagService.updateTag(tag.id, payload)
        toast.success(t('tags.updated'))
      } else {
        await tagService.createTag({ ...payload, deviceId: values.deviceId })
        toast.success(t('tags.created'))
      }
      onSaved()
      onClose()
    } catch (error) {
      setError('root', { message: resolveApiError(error, t('errors.saveFailed')) })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? t('tags.edit') : t('tags.add')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="tag-form" isLoading={isSubmitting}>
            {isEdit ? t('common.update') : t('common.create')}
          </Button>
        </>
      }
    >
      <form id="tag-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root?.message && (
          <p
            role="alert"
            className="rounded-card bg-error-50 px-3.5 py-2.5 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400"
          >
            {errors.root.message}
          </p>
        )}

        <Select
          isFullWidth
          label={t('tags.device')}
          placeholder={t('tags.selectDevice')}
          // Perangkat dikunci saat mengubah — lihat catatan di onSubmit.
          disabled={isEdit}
          error={errors.deviceId?.message}
          required
          options={devices.map((device) => ({ value: device.id, label: device.name }))}
          {...register('deviceId')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            isFullWidth
            label={t('tags.name')}
            placeholder={t('tags.namePlaceholder')}
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            isFullWidth
            mono
            label={t('tags.address')}
            placeholder={t('tags.addressPlaceholder')}
            hint={t('tags.addressHint')}
            error={errors.address?.message}
            required
            {...register('address')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            isFullWidth
            label={t('tags.dataType')}
            options={TAG_DATA_TYPES.map((type) => ({ value: type, label: type }))}
            error={errors.dataType?.message}
            required
            {...register('dataType')}
          />
          <Select
            isFullWidth
            label={t('tags.accessMode')}
            options={ACCESS_MODES.map((mode) => ({ value: mode, label: mode }))}
            error={errors.accessMode?.message}
            required
            {...register('accessMode')}
          />
          <Input
            isFullWidth
            label={t('tags.unit')}
            placeholder={t('tags.unitPlaceholder')}
            error={errors.unit?.message}
            {...register('unit')}
          />
        </div>

        <div className="rounded-card border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tags.scaling')}
            <RequiredMark />
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t('tags.scalingHint')}</p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              isFullWidth
              type="number"
              step="any"
              label={t('tags.rawMin')}
              error={errors.rawMin?.message}
              {...register('rawMin', { valueAsNumber: true })}
            />
            <Input
              isFullWidth
              type="number"
              step="any"
              label={t('tags.rawMax')}
              error={errors.rawMax?.message}
              {...register('rawMax', { valueAsNumber: true })}
            />
            <Input
              isFullWidth
              type="number"
              step="any"
              label={t('tags.euMin')}
              error={errors.euMin?.message}
              {...register('euMin', { valueAsNumber: true })}
            />
            <Input
              isFullWidth
              type="number"
              step="any"
              label={t('tags.euMax')}
              error={errors.euMax?.message}
              {...register('euMax', { valueAsNumber: true })}
            />
          </div>
        </div>

        <Input
          isFullWidth
          mono
          label={t('tags.opcNode')}
          hint={t('common.optional')}
          placeholder="ns=2;s=Line1.Temp"
          error={errors.opcUaNodeId?.message}
          {...register('opcUaNodeId')}
        />
      </form>
    </Modal>
  )
}

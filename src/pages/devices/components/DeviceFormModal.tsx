import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { RiPlugLine } from '@remixicon/react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Checkbox } from '@/components/ui/Checkbox'
import * as deviceService from '@/services/device.service'
import { resolveApiError } from '@/lib/apiError'
import {
  PROTOCOL_LABELS,
  type Device,
  type HttpConfig,
  type MqttConfig,
  type Protocol,
} from '@/types/device'

interface DeviceFormModalProps {
  open: boolean
  onClose: () => void
  /** `null` berarti membuat baru. */
  device: Device | null
  /** Protokol tab aktif — dipakai saat membuat perangkat baru. */
  protocol: Protocol
  onSaved: () => void
}

const HTTP_METHODS = ['GET', 'POST']

function defaultHttpConfig(): HttpConfig {
  return { url: '', method: 'GET', headers: null }
}

function defaultMqttConfig(): MqttConfig {
  return {
    protocol: 'mqtt',
    brokerUrl: 'localhost',
    port: 1883,
    // Broker menolak dua koneksi dengan client id sama — yang kedua memutus yang
    // pertama. Nilai acak per perangkat mencegah dua perangkat MQTT di gateway
    // ini saling menendang.
    clientId: `synapse-${crypto.randomUUID().slice(0, 8)}`,
    topic: '#',
    username: null,
    password: null,
    useTls: false,
  }
}

/**
 * Satu form untuk semua protokol, dengan bagian konfigurasi yang berganti
 * mengikuti protokolnya. Protokol sebuah perangkat TIDAK bisa diubah setelah
 * dibuat: `connectionConfig`-nya bertipe berbeda dan tag-tag yang menempel
 * memakai skema alamat yang berbeda — mengizinkannya berarti meninggalkan tag
 * yang menunjuk ke alamat yang tidak lagi berarti apa pun.
 */
export function DeviceFormModal({
  open,
  onClose,
  device,
  protocol,
  onSaved,
}: DeviceFormModalProps) {
  const { t } = useTranslation()
  const isEdit = Boolean(device)
  const activeProtocol = device?.protocol ?? protocol

  const [httpConfig, setHttpConfig] = useState<HttpConfig>(defaultHttpConfig)
  const [mqttConfig, setMqttConfig] = useState<MqttConfig>(defaultMqttConfig)
  const [headersText, setHeadersText] = useState('')
  const [headersError, setHeadersError] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(3, t('devices.nameMin')),
        description: z.string().trim().max(255).optional(),
        // `valueAsNumber` pada register di bawah yang mengubah string input
        // menjadi number, jadi skemanya cukup memvalidasi number murni. Memakai
        // `z.coerce.number()` di sini membuat tipe input skema jadi `unknown` dan
        // generic react-hook-form tidak lagi cocok.
        pollingInterval: z.number().int().min(100),
        isEnabled: z.boolean(),
      }),
    [t],
  )

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', pollingInterval: 1000, isEnabled: false },
  })

  // Form di-reset saat dibuka, bukan saat ditutup: modal tetap ter-mount di
  // antara pembukaan, dan tanpa reset di sini, mengklik "Ubah" pada perangkat
  // lain akan menampilkan nilai perangkat sebelumnya untuk sekejap.
  useEffect(() => {
    if (!open) return

    setSubmitError(null)
    setHeadersError(null)

    if (device) {
      reset({
        name: device.name,
        description: device.description ?? '',
        pollingInterval: device.pollingInterval,
        isEnabled: device.isEnabled,
      })

      if (device.protocol === 'HTTP') {
        const config = device.connectionConfig as HttpConfig
        setHttpConfig({ ...defaultHttpConfig(), ...config })
        setHeadersText(config.headers ? JSON.stringify(config.headers, null, 2) : '')
      } else if (device.protocol === 'MQTT') {
        setMqttConfig({ ...defaultMqttConfig(), ...(device.connectionConfig as MqttConfig) })
      }
      return
    }

    reset({ name: '', description: '', pollingInterval: 1000, isEnabled: false })
    setHttpConfig(defaultHttpConfig())
    setMqttConfig(defaultMqttConfig())
    setHeadersText('')
  }, [open, device, reset])

  /** Header diketik sebagai JSON. Diurai di satu tempat supaya tombol "Uji
   *  Koneksi" dan penyimpanan memakai hasil parse yang sama. */
  function parseHeaders(): Record<string, string> | null | false {
    const text = headersText.trim()
    if (!text) return null
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setHeadersError(t('devices.http.headersInvalid'))
        return false
      }
      setHeadersError(null)
      return parsed as Record<string, string>
    } catch {
      setHeadersError(t('devices.http.headersInvalid'))
      return false
    }
  }

  function buildConnectionConfig(): HttpConfig | MqttConfig | false {
    if (activeProtocol === 'HTTP') {
      if (!httpConfig.url.trim()) {
        setSubmitError(t('devices.urlRequired'))
        return false
      }
      const headers = parseHeaders()
      if (headers === false) return false
      return { ...httpConfig, url: httpConfig.url.trim(), headers }
    }

    if (!mqttConfig.brokerUrl.trim()) {
      setSubmitError(t('devices.brokerRequired'))
      return false
    }
    if (!mqttConfig.topic.trim()) {
      setSubmitError(t('devices.topicRequired'))
      return false
    }
    return {
      ...mqttConfig,
      brokerUrl: mqttConfig.brokerUrl.trim(),
      topic: mqttConfig.topic.trim(),
      // Field opsional dikirim `null`, bukan string kosong: string kosong akan
      // membuat klien MQTT mencoba autentikasi dengan username hampa alih-alih
      // menyambung anonim.
      username: mqttConfig.username?.trim() || null,
      password: mqttConfig.password?.trim() || null,
    }
  }

  async function handleTest() {
    const headers = parseHeaders()
    if (headers === false) return

    setTesting(true)
    try {
      const result = await deviceService.testHttpConnection({
        url: httpConfig.url.trim(),
        method: httpConfig.method,
        headers: headers ?? undefined,
      })
      if (result.isSuccess) {
        toast.success(t('devices.testSuccess', { status: result.responseStatusCode }))
      } else {
        toast.error(result.errorMessage || t('devices.testFailed'))
      }
    } catch (error) {
      toast.error(resolveApiError(error, t('devices.testFailed')))
    } finally {
      setTesting(false)
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null)
    const connectionConfig = buildConnectionConfig()
    if (connectionConfig === false) return

    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        isEnabled: values.isEnabled,
        pollingInterval: values.pollingInterval,
        connectionConfig,
      }

      if (device) {
        await deviceService.updateDevice(device.id, payload)
        toast.success(t('devices.updated'))
      } else {
        await deviceService.createDevice({ ...payload, protocol: activeProtocol })
        toast.success(t('devices.created'))
      }
      onSaved()
      onClose()
    } catch (error) {
      setSubmitError(resolveApiError(error, t('errors.saveFailed')))
    }
  }

  const isEnabled = watch('isEnabled')

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? t('devices.edit') : t('devices.add')}
      description={t('devices.protocolConfig', { protocol: PROTOCOL_LABELS[activeProtocol] })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          {/* `form="device-form"` menghubungkan tombol di footer modal ke form
              yang berada di luar pohonnya — tanpa itu ia harus memanggil
              handleSubmit sendiri, dan menekan Enter di dalam form akan
              menjalankan submit dua kali. */}
          <Button type="submit" form="device-form" isLoading={isSubmitting}>
            {isEdit ? t('common.update') : t('common.create')}
          </Button>
        </>
      }
    >
      <form id="device-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {submitError && (
          <p
            role="alert"
            className="rounded-card bg-error-50 px-3.5 py-2.5 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400"
          >
            {submitError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            isFullWidth
            label={t('common.name')}
            placeholder={t('devices.namePlaceholder')}
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            isFullWidth
            type="number"
            min={100}
            step={100}
            label={t('devices.pollingIntervalLabel')}
            hint={t('devices.pollingIntervalHint')}
            error={errors.pollingInterval?.message}
            required
            {...register('pollingInterval', { valueAsNumber: true })}
          />
        </div>

        <Textarea
          isFullWidth
          rows={2}
          label={t('common.description')}
          placeholder={t('devices.descriptionPlaceholder')}
          error={errors.description?.message}
          {...register('description')}
        />

        <Switch
          checked={isEnabled}
          onChange={(checked) => setValue('isEnabled', checked, { shouldDirty: true })}
          label={t('devices.enable')}
          description={t('devices.enableHint')}
        />

        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <RiPlugLine size={16} className="text-brand-500" />
            {t('devices.protocolConfig', { protocol: PROTOCOL_LABELS[activeProtocol] })}
          </h3>

          {activeProtocol === 'HTTP' && (
            <div className="mt-4 space-y-4">
              <Input
                isFullWidth
                mono
                label={t('devices.http.url')}
                placeholder="http://192.168.1.10/api/data"
                value={httpConfig.url}
                onChange={(event) => setHttpConfig({ ...httpConfig, url: event.target.value })}
                required
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  isFullWidth
                  label={t('devices.http.method')}
                  value={httpConfig.method}
                  onChange={(event) =>
                    setHttpConfig({ ...httpConfig, method: event.target.value })
                  }
                  options={HTTP_METHODS.map((method) => ({ value: method, label: method }))}
                  required
                />
                <div className="flex items-end">
                  <Button
                    variant="subtle"
                    onClick={() => void handleTest()}
                    isLoading={testing}
                    disabled={!httpConfig.url.trim()}
                    className="w-full"
                  >
                    {testing ? t('devices.testing') : t('devices.test')}
                  </Button>
                </div>
              </div>
              <Textarea
                isFullWidth
                mono
                rows={3}
                label={t('devices.http.headers')}
                hint={t('devices.http.headersHint')}
                error={headersError ?? undefined}
                placeholder={'{\n  "Authorization": "Bearer ..."\n}'}
                value={headersText}
                onChange={(event) => setHeadersText(event.target.value)}
              />
            </div>
          )}

          {activeProtocol === 'MQTT' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Input
                    isFullWidth
                    mono
                    label={t('devices.mqtt.brokerUrl')}
                    placeholder="192.168.1.20"
                    value={mqttConfig.brokerUrl}
                    onChange={(event) =>
                      setMqttConfig({ ...mqttConfig, brokerUrl: event.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  isFullWidth
                  type="number"
                  label={t('devices.mqtt.port')}
                  value={mqttConfig.port}
                  onChange={(event) =>
                    setMqttConfig({ ...mqttConfig, port: Number(event.target.value) })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  isFullWidth
                  mono
                  label={t('devices.mqtt.clientId')}
                  value={mqttConfig.clientId}
                  onChange={(event) =>
                    setMqttConfig({ ...mqttConfig, clientId: event.target.value })
                  }
                  required
                />
                <Input
                  isFullWidth
                  mono
                  label={t('devices.mqtt.topic')}
                  placeholder="plant/line1/#"
                  value={mqttConfig.topic}
                  onChange={(event) => setMqttConfig({ ...mqttConfig, topic: event.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  isFullWidth
                  label={t('devices.mqtt.username')}
                  hint={t('common.optional')}
                  value={mqttConfig.username ?? ''}
                  onChange={(event) =>
                    setMqttConfig({ ...mqttConfig, username: event.target.value })
                  }
                />
                <Input
                  isFullWidth
                  type="password"
                  label={t('devices.mqtt.password')}
                  hint={t('common.optional')}
                  value={mqttConfig.password ?? ''}
                  onChange={(event) =>
                    setMqttConfig({ ...mqttConfig, password: event.target.value })
                  }
                />
              </div>
              <Checkbox
                label={t('devices.mqtt.useTls')}
                checked={mqttConfig.useTls}
                onChange={(event) =>
                  setMqttConfig({
                    ...mqttConfig,
                    useTls: event.target.checked,
                    // Skema protokol harus ikut berubah, kalau tidak klien
                    // menyambung polos ke port TLS dan gagal tanpa penjelasan.
                    protocol: event.target.checked ? 'mqtts' : 'mqtt',
                  })
                }
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  )
}

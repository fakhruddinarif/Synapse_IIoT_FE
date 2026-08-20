import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDeviceStream } from '@/hooks/useDeviceStream'
import { useThemeStore } from '@/store/theme.store'
import { asChartNumber, classNames, formatDateTime, formatMs, formatValue } from '@/lib/utils'
import { connectionSummary, PROTOCOL_LABELS, type Device } from '@/types/device'

interface DeviceInfoModalProps {
  open: boolean
  onClose: () => void
  device: Device | null
}

/** Deret warna grafik. Diambil dari palet brand + aksen, bukan warna acak, dan
 *  urutannya dijaga tetap supaya field yang sama tidak berganti warna setiap
 *  dialog dibuka ulang. */
const SERIES_COLORS = ['#c43b65', '#2f7ed8', '#d97706', '#16a34a', '#8a2645', '#8cc2f7']

const MAX_SERIES = 4

export function DeviceInfoModal({ open, onClose, device }: DeviceInfoModalProps) {
  const { t } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const { connected, history, latest } = useDeviceStream(device?.id, open)
  const [selected, setSelected] = useState<string[]>([])

  /**
   * Field diambil dari pembacaan TERAKHIR, bukan dari gabungan seluruh riwayat.
   * Perangkat bisa mengubah bentuk payloadnya (firmware diganti, sensor
   * dilepas), dan menggabungkan riwayat akan terus menawarkan field yang sudah
   * tidak pernah dikirim lagi.
   */
  const fields = useMemo(() => {
    if (!latest?.data || typeof latest.data !== 'object') return []
    return Object.entries(latest.data).map(([key, value]) => ({
      key,
      numeric: asChartNumber(value) !== null,
    }))
  }, [latest])

  const numericFields = useMemo(
    () => fields.filter((field) => field.numeric).map((field) => field.key),
    [fields],
  )

  // Pilihan awal: beberapa field numerik pertama. Hanya dijalankan selama belum
  // ada pilihan — kalau tidak, setiap payload baru akan menimpa pilihan
  // operator, tepat ketika ia sedang mengamati satu sensor tertentu.
  useEffect(() => {
    if (selected.length > 0 || numericFields.length === 0) return
    setSelected(numericFields.slice(0, Math.min(2, numericFields.length)))
  }, [numericFields, selected.length])

  // Membuka dialog untuk perangkat lain berarti field yang berbeda — pilihan
  // lama tidak berlaku dan akan menghasilkan grafik kosong tanpa penjelasan.
  useEffect(() => {
    setSelected([])
  }, [device?.id])

  const chartData = useMemo(
    () =>
      history.map((reading) => {
        const point: Record<string, string | number | null> = {
          time: formatDateTime(reading.timestamp, 'HH:mm:ss'),
        }
        for (const key of selected) {
          point[key] = asChartNumber((reading.data as Record<string, unknown>)?.[key])
        }
        return point
      }),
    [history, selected],
  )

  function toggleField(key: string) {
    setSelected((previous) => {
      if (previous.includes(key)) return previous.filter((item) => item !== key)
      // Batas deret dijaga: enam garis di satu grafik kecil sudah tidak bisa
      // dibaca, dan legendanya memakan tinggi yang dibutuhkan grafiknya.
      if (previous.length >= MAX_SERIES) return previous
      return [...previous, key]
    })
  }

  if (!device) return null

  const axisColor = theme === 'dark' ? '#525252' : '#a3a3a3'
  const gridColor = theme === 'dark' ? '#262626' : '#e5e5e5'

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={device.name}
      description={t('devices.info.title')}
    >
      <div className="space-y-6">
        {/* ------------------------------ detail ------------------------------ */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('devices.info.details')}
            </h3>
            <Badge
              dot
              pulse={connected}
              variant={connected ? 'success' : 'neutral'}
            >
              {connected ? t('gateway.connected') : t('gateway.disconnected')}
            </Badge>
          </div>

          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <Detail label={t('devices.protocol')} value={PROTOCOL_LABELS[device.protocol]} />
            <Detail
              label={t('common.status')}
              value={
                <Badge variant={device.isEnabled ? 'success' : 'neutral'}>
                  {device.isEnabled ? t('common.enabled') : t('common.disabled')}
                </Badge>
              }
            />
            <Detail
              label={t('devices.pollingInterval')}
              value={formatMs(device.pollingInterval)}
            />
            <Detail label={t('common.createdAt')} value={formatDateTime(device.createdAt)} />
            <div className="sm:col-span-2">
              <Detail label={t('devices.connection')} value={connectionSummary(device)} mono />
            </div>
            {device.description && (
              <div className="sm:col-span-2">
                <Detail label={t('common.description')} value={device.description} />
              </div>
            )}
          </dl>
        </section>

        {/* --------------------------- payload terakhir ---------------------- */}
        <section className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('devices.info.latest')}
            </h3>
            {latest && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(latest.timestamp)}
              </span>
            )}
          </div>

          {latest ? (
            <>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={latest.status.toLowerCase() === 'success' ? 'success' : 'error'}
                >
                  {latest.status}
                </Badge>
                {latest.message && (
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {latest.message}
                  </span>
                )}
              </div>
              <pre className="mt-3 max-h-48 overflow-auto rounded-card bg-gray-50 p-3 font-mono text-xs text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                {JSON.stringify(latest.data, null, 2)}
              </pre>
            </>
          ) : (
            <EmptyState
              compact
              title={t('devices.info.waiting')}
              description={t('devices.info.waitingHint')}
            />
          )}
        </section>

        {/* ------------------------------ grafik ----------------------------- */}
        <section className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('devices.info.chart')}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('devices.info.points', { count: history.length })}
            </span>
          </div>

          {fields.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {t('devices.info.selectFields')}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {t('devices.info.selectFieldsHint')}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
                {fields.map((field) => (
                  <Checkbox
                    key={field.key}
                    label={
                      <span className="font-mono text-xs">
                        {field.key}
                        {!field.numeric && (
                          <span className="ml-1 font-sans text-[11px] text-gray-400">
                            ({t('devices.info.nonNumeric')})
                          </span>
                        )}
                      </span>
                    }
                    checked={selected.includes(field.key)}
                    disabled={
                      !field.numeric ||
                      (!selected.includes(field.key) && selected.length >= MAX_SERIES)
                    }
                    onChange={() => toggleField(field.key)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 h-72">
            {chartData.length > 0 && selected.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: axisColor }}
                    stroke={gridColor}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: axisColor }}
                    stroke={gridColor}
                    domain={['auto', 'auto']}
                    width={56}
                  />
                  <ChartTooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${gridColor}`,
                      background: theme === 'dark' ? '#171717' : '#ffffff',
                      fontSize: 12,
                    }}
                  />
                  {selected.map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      // Animasi dimatikan: data masuk setiap beberapa ratus
                      // milidetik, dan transisi garis membuat setiap titik baru
                      // tampak melompat alih-alih bertambah.
                      isAnimationActive={false}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-card border border-dashed border-gray-200 dark:border-gray-800">
                <p className="px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  {fields.length === 0
                    ? t('devices.info.waiting')
                    : t('devices.info.noSelection')}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Modal>
  )
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd
        className={classNames(
          'mt-0.5 truncate text-sm text-gray-900 dark:text-gray-100',
          mono && 'font-mono text-[13px]',
        )}
      >
        {typeof value === 'string' ? formatValue(value) : value}
      </dd>
    </div>
  )
}

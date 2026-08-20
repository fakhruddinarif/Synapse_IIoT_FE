import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RiArrowRightSLine, RiRouterLine } from '@remixicon/react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonText } from '@/components/ui/Skeleton'
import { useRealtimeStore } from '@/store/realtime.store'
import { formatRelative } from '@/lib/utils'
import { PROTOCOL_LABELS, type Device } from '@/types/device'

interface DeviceStatusPanelProps {
  devices: Device[]
  loading: boolean
}

/**
 * Daftar perangkat dengan status yang diturunkan dari stream, bukan dari kolom
 * database.
 *
 * Bedanya penting: `isEnabled` hanya menyatakan niat ("perangkat ini seharusnya
 * dihubungi"), sementara ada-tidaknya pembacaan di jendela realtime menyatakan
 * kenyataan ("perangkat ini benar-benar menjawab"). Operator perlu keduanya —
 * perangkat yang aktif tapi diam adalah masalah, dan perangkat yang dimatikan
 * dengan sengaja bukan.
 */
export function DeviceStatusPanel({ devices, loading }: DeviceStatusPanelProps) {
  const { t } = useTranslation()
  const readings = useRealtimeStore((s) => s.readings)

  return (
    <Card padding="none" className="flex h-full flex-col">
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <CardHeader
          title={t('dashboard.devices.title')}
          description={t('dashboard.devices.subtitle')}
          action={
            <Link
              to="/connectivity/devices"
              className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
            >
              {t('dashboard.devices.viewAll')}
              <RiArrowRightSLine size={14} />
            </Link>
          }
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-4 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonText key={index} lines={2} />
            ))}
          </div>
        )}

        {!loading && devices.length === 0 && (
          <EmptyState
            compact
            icon={<RiRouterLine size={32} />}
            title={t('dashboard.devices.empty')}
            description={t('dashboard.devices.emptyHint')}
          />
        )}

        {!loading && devices.length > 0 && (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {devices.map((device) => {
              const latest = readings[device.id]?.at(-1)
              const state = !device.isEnabled ? 'paused' : latest ? 'streaming' : 'idle'

              return (
                <li key={device.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {device.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{PROTOCOL_LABELS[device.protocol]}</span>
                      <span aria-hidden>·</span>
                      <span className="truncate">
                        {latest
                          ? `${t('dashboard.devices.lastSeen')} ${formatRelative(latest.timestamp)}`
                          : t('devices.pollingInterval') + ` ${device.pollingInterval} ms`}
                      </span>
                    </p>
                  </div>

                  <Badge
                    dot
                    pulse={state === 'streaming'}
                    variant={
                      state === 'streaming' ? 'success' : state === 'idle' ? 'warning' : 'neutral'
                    }
                    className="shrink-0"
                  >
                    {state === 'streaming' && t('dashboard.devices.streaming')}
                    {state === 'idle' && t('dashboard.devices.idle')}
                    {state === 'paused' && t('dashboard.devices.paused')}
                  </Badge>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}

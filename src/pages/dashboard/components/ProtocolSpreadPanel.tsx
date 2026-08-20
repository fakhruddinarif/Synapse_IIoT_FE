import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PROTOCOL_LABELS, type Device, type Protocol } from '@/types/device'

/**
 * Sebaran perangkat per protokol sebagai batang berbanding, bukan pie chart.
 * Yang dibaca di sini adalah perbandingan panjang antar kategori, dan mata jauh
 * lebih akurat membandingkan panjang daripada sudut — terutama untuk kategori
 * kecil dengan satu-dua perangkat.
 */
export function ProtocolSpreadPanel({ devices }: { devices: Device[] }) {
  const { t } = useTranslation()

  const counts = devices.reduce<Partial<Record<Protocol, number>>>((accumulator, device) => {
    accumulator[device.protocol] = (accumulator[device.protocol] ?? 0) + 1
    return accumulator
  }, {})

  const rows = Object.entries(counts)
    .map(([protocol, count]) => ({ protocol: protocol as Protocol, count: count ?? 0 }))
    .sort((a, b) => b.count - a.count)

  const max = rows[0]?.count ?? 0

  return (
    <Card padding="lg" className="h-full">
      <CardHeader title={t('dashboard.protocol.title')} />

      {rows.length === 0 ? (
        <EmptyState compact title={t('dashboard.protocol.empty')} />
      ) : (
        <ul className="mt-5 space-y-3.5">
          {rows.map(({ protocol, count }) => (
            <li key={protocol}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {PROTOCOL_LABELS[protocol]}
                </span>
                <span className="tnum text-xs font-semibold text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-pill bg-brand-400 transition-[width] duration-500 dark:bg-brand-300"
                  style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

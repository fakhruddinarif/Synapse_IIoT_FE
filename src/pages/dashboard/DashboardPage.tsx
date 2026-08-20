import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiRouterLine, RiPulseLine, RiTableLine, RiFlowChart } from '@remixicon/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SkeletonStats } from '@/components/ui/Skeleton'
import { StatCard } from './components/StatCard'
import { PipelinePanel } from './components/PipelinePanel'
import { DeviceStatusPanel } from './components/DeviceStatusPanel'
import { ProtocolSpreadPanel } from './components/ProtocolSpreadPanel'
import { useAllDevices } from '@/hooks/useDevices'
import { useMasterTables } from '@/hooks/useMasterTables'
import { useStorageFlows } from '@/hooks/useStorageFlows'
import { useRealtimeStore } from '@/store/realtime.store'
import { subscribeDevice, unsubscribeDevice } from '@/lib/signalr'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { devices, loading: devicesLoading } = useAllDevices()
  const { allTables, loading: tablesLoading } = useMasterTables()
  const { allFlows, loading: flowsLoading } = useStorageFlows()
  const readings = useRealtimeStore((s) => s.readings)

  /**
   * Dasbor berlangganan SETIAP perangkat yang aktif.
   *
   * Ini satu-satunya halaman yang melakukannya, dan itu memang tugasnya: kalau
   * hanya berlangganan perangkat yang sedang dilihat, kolom status akan
   * menampilkan "menunggu" untuk perangkat yang sebenarnya mengirim data dengan
   * rajin. Perangkat yang dimatikan sengaja dilewati — tidak ada gunanya
   * membuka grup hub untuk sumber yang memang tidak dihubungi gateway.
   */
  useEffect(() => {
    const active = devices.filter((device) => device.isEnabled)
    active.forEach((device) => void subscribeDevice(device.id))
    return () => {
      active.forEach((device) => void unsubscribeDevice(device.id))
    }
  }, [devices])

  const enabledCount = devices.filter((device) => device.isEnabled).length
  const streamingCount = devices.filter((device) => readings[device.id]?.length).length
  const activeTables = allTables.filter((table) => table.isActive).length
  const activeFlows = allFlows.filter((flow) => flow.isActive).length

  const loading = devicesLoading || tablesLoading || flowsLoading

  return (
    <div>
      <PageHeader title={t('dashboard.title')} description={t('dashboard.subtitle')} />

      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label={t('dashboard.stat.devices')}
            value={devices.length}
            hint={t('dashboard.stat.devicesEnabled', { count: enabledCount })}
            icon={<RiRouterLine size={16} />}
            tone="brand"
          />
          <StatCard
            label={t('dashboard.stat.streaming')}
            value={streamingCount}
            hint={t('dashboard.stat.streamingHint')}
            icon={<RiPulseLine size={16} />}
            tone="success"
          />
          <StatCard
            label={t('dashboard.stat.tables')}
            value={allTables.length}
            hint={t('dashboard.stat.tablesActive', { count: activeTables })}
            icon={<RiTableLine size={16} />}
            tone="accent"
          />
          <StatCard
            label={t('dashboard.stat.flows')}
            value={allFlows.length}
            hint={t('dashboard.stat.flowsActive', { count: activeFlows })}
            icon={<RiFlowChart size={16} />}
            tone="warning"
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PipelinePanel
            deviceCount={devices.length}
            streamingCount={streamingCount}
            tableCount={allTables.length}
            activeFlowCount={activeFlows}
          />
        </div>
        <ProtocolSpreadPanel devices={devices} />
      </div>

      <div className="mt-4">
        <DeviceStatusPanel devices={devices} loading={devicesLoading} />
      </div>
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { RiRouterFill, RiDatabase2Fill } from '@remixicon/react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Logo } from '@/components/layout/Logo'

interface PipelinePanelProps {
  deviceCount: number
  streamingCount: number
  tableCount: number
  activeFlowCount: number
}

/**
 * Diagram tiga simpul: perangkat lapangan → gateway → tabel tujuan.
 *
 * Ini satu-satunya tempat di aplikasi yang menjawab "sistem ini sebenarnya
 * melakukan apa" dalam satu tatapan, dan itu yang paling sering ditanyakan orang
 * yang baru melihat panelnya. Garis putus-putus yang bergerak hanya bergerak
 * ketika benar-benar ada flow aktif — animasi yang berjalan saat tidak ada data
 * yang ditulis akan berbohong.
 */
export function PipelinePanel({
  deviceCount,
  streamingCount,
  tableCount,
  activeFlowCount,
}: PipelinePanelProps) {
  const { t } = useTranslation()
  const flowing = activeFlowCount > 0

  return (
    <Card padding="lg">
      <CardHeader
        title={t('dashboard.pipeline.title')}
        description={t('dashboard.pipeline.subtitle')}
      />

      <div className="mt-6 flex items-center justify-between gap-2">
        <Node
          icon={<RiRouterFill size={20} />}
          label={t('dashboard.pipeline.devices')}
          value={deviceCount}
          caption={`${streamingCount} ${t('dashboard.devices.streaming').toLowerCase()}`}
          tone="ot"
        />

        <Connector active={streamingCount > 0} />

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-card bg-brand-500/10 ring-1 ring-brand-200 dark:ring-brand-500/30">
            <Logo className="h-9 w-9" />
          </span>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {t('dashboard.pipeline.gateway')}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {t('dashboard.pipeline.flowCount', { count: activeFlowCount })}
            </p>
          </div>
        </div>

        <Connector active={flowing} />

        <Node
          icon={<RiDatabase2Fill size={20} />}
          label={t('dashboard.pipeline.tables')}
          value={tableCount}
          caption={t('app.itLayer')}
          tone="it"
        />
      </div>
    </Card>
  )
}

function Node({
  icon,
  label,
  value,
  caption,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  caption: string
  tone: 'ot' | 'it'
}) {
  const toneClass =
    tone === 'ot'
      ? 'bg-brand-100 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30'
      : 'bg-accent-50 text-accent-600 ring-accent-100 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/30'

  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-card ring-1 ${toneClass}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="tnum text-sm font-semibold text-gray-900 dark:text-white">
          {value} <span className="text-xs font-normal text-gray-500">{label}</span>
        </p>
        <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">{caption}</p>
      </div>
    </div>
  )
}

/** Garis penghubung. SVG, bukan border bergaya dashed, karena hanya
 *  `stroke-dashoffset` yang bisa dianimasikan untuk memberi kesan arah aliran. */
function Connector({ active }: { active: boolean }) {
  return (
    <svg
      className="h-4 min-w-8 flex-1"
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="0"
        y1="4"
        x2="100"
        y2="4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 6"
        className={
          active
            ? 'animate-flow-dash stroke-brand-400 dark:stroke-brand-300'
            : 'stroke-gray-300 dark:stroke-gray-700'
        }
      />
    </svg>
  )
}

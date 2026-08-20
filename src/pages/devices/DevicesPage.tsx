import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiInformationLine,
  RiRouterLine,
  RiSearchLine,
  RiTimeLine,
} from '@remixicon/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Tooltip } from '@/components/ui/Tooltip'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SkeletonCards } from '@/components/ui/Skeleton'
import { DeviceFormModal } from './components/DeviceFormModal'
import { DeviceInfoModal } from './components/DeviceInfoModal'
import { useDevices } from '@/hooks/useDevices'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCanDelete, useCanWrite } from '@/store/auth.store'
import { useRealtimeStore } from '@/store/realtime.store'
import * as deviceService from '@/services/device.service'
import { resolveApiError } from '@/lib/apiError'
import { formatMs, formatRelative } from '@/lib/utils'
import {
  connectionSummary,
  PROTOCOL_LABELS,
  SUPPORTED_PROTOCOLS,
  type Device,
  type Protocol,
} from '@/types/device'

const PAGE_SIZE = 9

export default function DevicesPage() {
  const { t } = useTranslation()
  const canWrite = useCanWrite()
  const canDelete = useCanDelete()

  const [protocol, setProtocol] = useState<Protocol>('HTTP')
  const [searchInput, setSearchInput] = useState('')
  // Pencarian ditunda: setiap ketikan di sini adalah satu request ke gateway
  // yang juga sedang melakukan polling perangkat.
  const search = useDebouncedValue(searchInput)

  const { devices, paging, loading, error, goToPage, refetch } = useDevices({
    protocol,
    search,
    pageSize: PAGE_SIZE,
  })

  const readings = useRealtimeStore((s) => s.readings)

  const [formTarget, setFormTarget] = useState<{ open: boolean; device: Device | null }>({
    open: false,
    device: null,
  })
  const [infoTarget, setInfoTarget] = useState<Device | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deviceService.deleteDevice(deleteTarget.id)
      toast.success(t('devices.deleted'))
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(resolveApiError(err, t('errors.deleteFailed')))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('devices.title')}
        description={t('devices.subtitle')}
        action={
          canWrite && (
            <Button
              leftIcon={<RiAddLine size={16} />}
              onClick={() => setFormTarget({ open: true, device: null })}
            >
              {t('devices.add')}
            </Button>
          )
        }
      />

      <Card padding="none">
        <div className="px-4 pt-4">
          <Tabs
            items={SUPPORTED_PROTOCOLS.map((item) => ({
              key: item,
              label: PROTOCOL_LABELS[item],
            }))}
            active={protocol}
            onChange={(key) => setProtocol(key as Protocol)}
          />
        </div>

        <div className="p-4">
          <div className="mb-4 flex justify-end">
            <div className="w-full sm:w-72">
              <Input
                isFullWidth
                type="search"
                placeholder={t('devices.searchPlaceholder')}
                leftIcon={<RiSearchLine size={16} />}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-card bg-error-50 px-4 py-3 dark:bg-error-500/10">
              <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
              <Button variant="secondary" size="sm" onClick={refetch}>
                {t('common.retry')}
              </Button>
            </div>
          )}

          {loading && <SkeletonCards count={PAGE_SIZE} />}

          {!loading && devices.length === 0 && (
            <EmptyState
              icon={<RiRouterLine size={44} />}
              title={
                search
                  ? t('devices.emptySearch')
                  : t('devices.empty', { protocol: PROTOCOL_LABELS[protocol] })
              }
              description={search ? t('devices.emptySearchHint') : t('devices.emptyHint')}
              actionLabel={!search && canWrite ? t('devices.add') : undefined}
              onAction={
                !search && canWrite
                  ? () => setFormTarget({ open: true, device: null })
                  : undefined
              }
            />
          )}

          {!loading && devices.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((device) => {
                const latest = readings[device.id]?.at(-1)
                return (
                  <div
                    key={device.id}
                    className="flex flex-col rounded-card border border-gray-200 bg-white p-4 shadow-card transition-shadow hover:shadow-dropdown dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {device.name}
                        </p>
                        {device.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                            {device.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        dot
                        pulse={Boolean(latest) && device.isEnabled}
                        variant={device.isEnabled ? 'success' : 'neutral'}
                      >
                        {device.isEnabled ? t('common.enabled') : t('common.disabled')}
                      </Badge>
                    </div>

                    <dl className="mt-4 flex-1 space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                        <dt className="sr-only">{t('devices.connection')}</dt>
                        <RiRouterLine size={14} className="mt-px shrink-0" />
                        <dd className="truncate font-mono text-[11px]">
                          {connectionSummary(device)}
                        </dd>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <dt className="sr-only">{t('devices.pollingInterval')}</dt>
                        <RiTimeLine size={14} className="shrink-0" />
                        <dd>
                          {formatMs(device.pollingInterval)}
                          {latest && (
                            <span className="ml-1.5 text-gray-400 dark:text-gray-500">
                              · {formatRelative(latest.timestamp)}
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-gray-100 pt-3 dark:border-gray-800">
                      <Tooltip content={t('common.info')}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('common.info')}
                          onClick={() => setInfoTarget(device)}
                        >
                          <RiInformationLine size={16} />
                        </Button>
                      </Tooltip>
                      {canWrite && (
                        <Tooltip content={t('common.edit')}>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t('common.edit')}
                            onClick={() => setFormTarget({ open: true, device })}
                          >
                            <RiEditLine size={16} />
                          </Button>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip content={t('common.delete')}>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t('common.delete')}
                            className="text-error-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                            onClick={() => setDeleteTarget(device)}
                          >
                            <RiDeleteBinLine size={16} />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <Pagination paging={paging} onPageChange={goToPage} loading={loading} />
      </Card>

      <DeviceFormModal
        open={formTarget.open}
        device={formTarget.device}
        protocol={protocol}
        onClose={() => setFormTarget({ open: false, device: null })}
        onSaved={refetch}
      />

      <DeviceInfoModal
        open={Boolean(infoTarget)}
        device={infoTarget}
        onClose={() => setInfoTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={t('devices.deleteTitle')}
        description={t('devices.deleteBody', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        loading={deleting}
        danger
      />
    </div>
  )
}

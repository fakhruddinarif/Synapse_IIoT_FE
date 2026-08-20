import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RiAddLine,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFlowChart,
  RiRouterLine,
  RiSearchLine,
  RiTableLine,
} from '@remixicon/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Tooltip } from '@/components/ui/Tooltip'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StorageFlowFormModal } from './components/StorageFlowFormModal'
import { useStorageFlows } from '@/hooks/useStorageFlows'
import { useMasterTables } from '@/hooks/useMasterTables'
import { useAllDevices } from '@/hooks/useDevices'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCanDelete, useCanWrite } from '@/store/auth.store'
import * as storageFlowService from '@/services/storage-flow.service'
import { resolveApiError } from '@/lib/apiError'
import { formatMs } from '@/lib/utils'
import { type StorageFlow } from '@/types/storage-flow'

/** Sebanyak ini perangkat/mapping ditampilkan penuh di sel tabel; sisanya
 *  diringkas jadi "+n lainnya". Tanpa batas, satu flow dengan sepuluh mapping
 *  membuat barisnya lebih tinggi dari layar. */
const INLINE_LIMIT = 2

export default function StorageFlowsPage() {
  const { t } = useTranslation()
  const canWrite = useCanWrite()
  const canDelete = useCanDelete()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput)
  const { flows, paging, loading, error, goToPage, refetch } = useStorageFlows(search)

  // Form butuh daftar perangkat dan tabel; dimuat di halaman, bukan di dalam
  // modal, supaya membuka form tidak selalu menunggu dua request lagi.
  const { devices } = useAllDevices()
  const { allTables } = useMasterTables()

  const [formTarget, setFormTarget] = useState<{ open: boolean; flow: StorageFlow | null }>({
    open: false,
    flow: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<StorageFlow | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await storageFlowService.deleteStorageFlow(deleteTarget.id)
      toast.success(t('flows.deleted'))
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(resolveApiError(err, t('errors.deleteFailed')))
    } finally {
      setDeleting(false)
    }
  }

  const columns: TableColumn<StorageFlow>[] = [
    {
      key: 'name',
      header: t('common.name'),
      render: (flow) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 dark:text-white">{flow.name}</p>
          {flow.description && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{flow.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'devices',
      header: t('flows.devices'),
      hideBelow: 'md',
      render: (flow) => (
        <div className="flex flex-wrap items-center gap-1">
          {flow.devices.slice(0, INLINE_LIMIT).map((device) => (
            <Badge key={device.deviceId} variant="brand">
              <RiRouterLine size={12} />
              {device.deviceName || device.deviceId}
            </Badge>
          ))}
          {flow.devices.length > INLINE_LIMIT && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('flows.moreItems', { count: flow.devices.length - INLINE_LIMIT })}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'table',
      header: t('flows.table'),
      hideBelow: 'lg',
      render: (flow) => (
        <span className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
          <RiTableLine size={14} className="shrink-0 text-accent-500" />
          <span className="truncate">{flow.masterTableName || flow.masterTableId}</span>
        </span>
      ),
    },
    {
      key: 'mappings',
      header: t('flows.mappings'),
      hideBelow: 'xl',
      render: (flow) => (
        <div className="space-y-1">
          {flow.mappings.slice(0, INLINE_LIMIT).map((mapping) => (
            <div
              key={mapping.id}
              className="flex items-center gap-1 font-mono text-[11px] text-gray-600 dark:text-gray-300"
            >
              <span className="truncate">{mapping.sourcePath}</span>
              <RiArrowRightLine size={12} className="shrink-0 text-gray-400" />
              <span className="truncate text-accent-600 dark:text-accent-300">
                {mapping.fieldName}
              </span>
            </div>
          ))}
          {flow.mappings.length > INLINE_LIMIT && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('flows.moreItems', { count: flow.mappings.length - INLINE_LIMIT })}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'interval',
      header: t('flows.interval'),
      render: (flow) => (
        <span className="tnum text-xs text-gray-600 dark:text-gray-300">
          {formatMs(flow.storageInterval)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (flow) => (
        <Badge dot pulse={flow.isActive} variant={flow.isActive ? 'success' : 'neutral'}>
          {flow.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      width: '110px',
      render: (flow) => (
        <div className="flex justify-end gap-1">
          {canWrite && (
            <Tooltip content={t('common.edit')}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common.edit')}
                onClick={() => setFormTarget({ open: true, flow })}
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
                onClick={() => setDeleteTarget(flow)}
              >
                <RiDeleteBinLine size={16} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('flows.title')}
        description={t('flows.subtitle')}
        action={
          canWrite && (
            <Button
              leftIcon={<RiAddLine size={16} />}
              onClick={() => setFormTarget({ open: true, flow: null })}
            >
              {t('flows.add')}
            </Button>
          )
        }
      />

      <Card padding="none">
        <div className="flex justify-end p-4">
          <div className="w-full sm:w-72">
            <Input
              isFullWidth
              type="search"
              placeholder={t('flows.searchPlaceholder')}
              leftIcon={<RiSearchLine size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-card bg-error-50 px-4 py-3 dark:bg-error-500/10">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
            <Button variant="secondary" size="sm" onClick={refetch}>
              {t('common.retry')}
            </Button>
          </div>
        )}

        <div className="px-4">
          <Table
            columns={columns}
            data={flows}
            keyExtractor={(flow) => flow.id}
            isLoading={loading}
            emptyState={
              <EmptyState
                icon={<RiFlowChart size={40} />}
                title={t('flows.empty')}
                description={t('flows.emptyHint')}
                actionLabel={canWrite ? t('flows.add') : undefined}
                onAction={canWrite ? () => setFormTarget({ open: true, flow: null }) : undefined}
              />
            }
          />
        </div>

        <Pagination paging={paging} onPageChange={goToPage} loading={loading} />
      </Card>

      <StorageFlowFormModal
        open={formTarget.open}
        flow={formTarget.flow}
        devices={devices}
        tables={allTables}
        onClose={() => setFormTarget({ open: false, flow: null })}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={t('flows.deleteTitle')}
        description={t('flows.deleteBody', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        loading={deleting}
        danger
      />
    </div>
  )
}

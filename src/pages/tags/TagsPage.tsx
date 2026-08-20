import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiPriceTag3Line,
  RiSearchLine,
} from '@remixicon/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Tooltip } from '@/components/ui/Tooltip'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { TagFormModal } from './components/TagFormModal'
import { useTags } from '@/hooks/useTags'
import { useAllDevices } from '@/hooks/useDevices'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCanDelete, useCanWrite } from '@/store/auth.store'
import * as tagService from '@/services/tag.service'
import { resolveApiError } from '@/lib/apiError'
import type { Tag } from '@/types/tag'

export default function TagsPage() {
  const { t } = useTranslation()
  const canWrite = useCanWrite()
  const canDelete = useCanDelete()

  const { devices } = useAllDevices()
  const [deviceId, setDeviceId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput)

  const { tags, paging, loading, error, goToPage, refetch } = useTags({ deviceId, search })

  const [formTarget, setFormTarget] = useState<{ open: boolean; tag: Tag | null }>({
    open: false,
    tag: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Nama perangkat tidak ikut pada respons tag (hanya `deviceId`), jadi
  // dipetakan di sini — tabel yang hanya menampilkan GUID tidak berguna bagi
  // siapa pun yang membacanya.
  const deviceNames = useMemo(
    () => new Map(devices.map((device) => [device.id, device.name])),
    [devices],
  )

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await tagService.deleteTag(deleteTarget.id)
      toast.success(t('tags.deleted'))
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(resolveApiError(err, t('errors.deleteFailed')))
    } finally {
      setDeleting(false)
    }
  }

  const columns: TableColumn<Tag>[] = [
    {
      key: 'name',
      header: t('tags.name'),
      render: (tag) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 dark:text-white">{tag.name}</p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {deviceNames.get(tag.deviceId) ?? tag.deviceId}
          </p>
        </div>
      ),
    },
    {
      key: 'address',
      header: t('tags.address'),
      render: (tag) => <code className="font-mono text-xs">{tag.address}</code>,
    },
    {
      key: 'dataType',
      header: t('tags.dataType'),
      render: (tag) => <Badge variant="accent">{tag.dataType}</Badge>,
    },
    {
      key: 'scaling',
      header: t('tags.scaling'),
      hideBelow: 'md',
      render: (tag) => (
        <span className="tnum font-mono text-xs text-gray-600 dark:text-gray-300">
          {tag.rawMin}–{tag.rawMax} → {tag.euMin}–{tag.euMax}
          {tag.unit ? ` ${tag.unit}` : ''}
        </span>
      ),
    },
    {
      key: 'accessMode',
      header: t('tags.accessMode'),
      hideBelow: 'lg',
      render: (tag) => (
        <Badge variant={tag.accessMode === 'READWRITE' ? 'warning' : 'neutral'}>
          {tag.accessMode}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      width: '110px',
      render: (tag) => (
        <div className="flex justify-end gap-1">
          {canWrite && (
            <Tooltip content={t('common.edit')}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common.edit')}
                onClick={() => setFormTarget({ open: true, tag })}
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
                onClick={() => setDeleteTarget(tag)}
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
        title={t('tags.title')}
        description={t('tags.subtitle')}
        action={
          canWrite && (
            <Button
              leftIcon={<RiAddLine size={16} />}
              disabled={devices.length === 0}
              onClick={() => setFormTarget({ open: true, tag: null })}
            >
              {t('tags.add')}
            </Button>
          )
        }
      />

      <Card padding="none">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <Select
              isFullWidth
              value={deviceId}
              onChange={(event) => setDeviceId(event.target.value)}
              options={[
                { value: '', label: t('tags.allDevices') },
                ...devices.map((device) => ({ value: device.id, label: device.name })),
              ]}
            />
          </div>
          <div className="w-full sm:w-72">
            <Input
              isFullWidth
              type="search"
              placeholder={t('tags.searchPlaceholder')}
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
            data={tags}
            keyExtractor={(tag) => tag.id}
            isLoading={loading}
            emptyState={
              <EmptyState
                icon={<RiPriceTag3Line size={40} />}
                title={devices.length === 0 ? t('tags.emptyPickDevice') : t('tags.empty')}
                description={
                  devices.length === 0 ? t('tags.emptyPickDeviceHint') : t('tags.emptyHint')
                }
              />
            }
          />
        </div>

        <Pagination paging={paging} onPageChange={goToPage} loading={loading} />
      </Card>

      <TagFormModal
        open={formTarget.open}
        tag={formTarget.tag}
        devices={devices}
        defaultDeviceId={deviceId || undefined}
        onClose={() => setFormTarget({ open: false, tag: null })}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={t('tags.deleteTitle')}
        description={t('tags.deleteBody', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        loading={deleting}
        danger
      />
    </div>
  )
}

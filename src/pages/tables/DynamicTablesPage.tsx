import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiListSettingsLine,
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
import { MasterTableFormModal } from './components/MasterTableFormModal'
import { TableFieldsModal } from './components/TableFieldsModal'
import { useMasterTables } from '@/hooks/useMasterTables'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCanDelete, useCanWrite } from '@/store/auth.store'
import * as masterTableService from '@/services/master-table.service'
import { resolveApiError } from '@/lib/apiError'
import { formatDateTime } from '@/lib/utils'
import type { MasterTable } from '@/types/master-table'

export default function DynamicTablesPage() {
  const { t } = useTranslation()
  const canWrite = useCanWrite()
  const canDelete = useCanDelete()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput)
  const { tables, paging, loading, error, goToPage, refetch } = useMasterTables(search)

  const [formTarget, setFormTarget] = useState<{ open: boolean; table: MasterTable | null }>({
    open: false,
    table: null,
  })
  const [fieldsTarget, setFieldsTarget] = useState<MasterTable | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MasterTable | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await masterTableService.deleteMasterTable(deleteTarget.id)
      toast.success(t('tables.deleted'))
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(resolveApiError(err, t('errors.deleteFailed')))
    } finally {
      setDeleting(false)
    }
  }

  const columns: TableColumn<MasterTable>[] = [
    {
      key: 'name',
      header: t('common.name'),
      render: (table) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 dark:text-white">{table.name}</p>
          <code className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">
            {table.tableName}
          </code>
        </div>
      ),
    },
    {
      key: 'description',
      header: t('common.description'),
      hideBelow: 'lg',
      render: (table) => (
        <span className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
          {table.description || '-'}
        </span>
      ),
    },
    {
      key: 'fields',
      header: t('tables.fields'),
      render: (table) => (
        <Badge variant="accent">{t('tables.fieldsCount', { count: table.fields.length })}</Badge>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (table) => (
        <Badge dot variant={table.isActive ? 'success' : 'neutral'}>
          {table.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('common.createdAt'),
      hideBelow: 'xl',
      render: (table) => (
        <span className="tnum text-xs text-gray-500 dark:text-gray-400">
          {formatDateTime(table.createdAt, 'dd MMM yyyy HH:mm')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      width: '150px',
      render: (table) => (
        <div className="flex justify-end gap-1">
          <Tooltip content={t('tables.manageFields')}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('tables.manageFields')}
              onClick={() => setFieldsTarget(table)}
            >
              <RiListSettingsLine size={16} />
            </Button>
          </Tooltip>
          {canWrite && (
            <Tooltip content={t('common.edit')}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common.edit')}
                onClick={() => setFormTarget({ open: true, table })}
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
                onClick={() => setDeleteTarget(table)}
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
        title={t('tables.title')}
        description={t('tables.subtitle')}
        action={
          canWrite && (
            <Button
              leftIcon={<RiAddLine size={16} />}
              onClick={() => setFormTarget({ open: true, table: null })}
            >
              {t('tables.add')}
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
              placeholder={t('tables.searchPlaceholder')}
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
            data={tables}
            keyExtractor={(table) => table.id}
            isLoading={loading}
            emptyState={
              <EmptyState
                icon={<RiTableLine size={40} />}
                title={t('tables.empty')}
                description={t('tables.emptyHint')}
                actionLabel={canWrite ? t('tables.add') : undefined}
                onAction={canWrite ? () => setFormTarget({ open: true, table: null }) : undefined}
              />
            }
          />
        </div>

        <Pagination paging={paging} onPageChange={goToPage} loading={loading} />
      </Card>

      <MasterTableFormModal
        open={formTarget.open}
        table={formTarget.table}
        onClose={() => setFormTarget({ open: false, table: null })}
        onSaved={refetch}
      />

      <TableFieldsModal
        open={Boolean(fieldsTarget)}
        table={fieldsTarget}
        onClose={() => setFieldsTarget(null)}
        onChanged={refetch}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={t('tables.deleteTitle')}
        description={t('tables.deleteBody', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        loading={deleting}
        danger
      />
    </div>
  )
}

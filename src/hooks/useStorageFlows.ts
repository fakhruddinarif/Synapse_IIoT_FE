import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE } from '@/config/app'
import * as storageFlowService from '@/services/storage-flow.service'
import { resolveApiError } from '@/lib/apiError'
import type { Paging } from '@/types/api'
import type { StorageFlow } from '@/types/storage-flow'

/** Sama seperti `useMasterTables`: backend mengembalikan seluruh daftar tanpa
 *  paging, jadi pencarian dan paginasi dikerjakan klien. */
export function useStorageFlows(search = '', pageSize = PAGE_SIZE) {
  const [all, setAll] = useState<StorageFlow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setAll(await storageFlowService.fetchStorageFlows())
    } catch (err) {
      setError(resolveApiError(err, 'Gagal memuat daftar storage flow'))
      setAll([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return all
    return all.filter(
      (flow) =>
        flow.name.toLowerCase().includes(term) ||
        (flow.description ?? '').toLowerCase().includes(term) ||
        flow.masterTableName.toLowerCase().includes(term) ||
        flow.devices.some((device) => device.deviceName.toLowerCase().includes(term)),
    )
  }, [all, search])

  useEffect(() => {
    setPage(1)
  }, [search])

  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPage)
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const paging: Paging = {
    page: safePage,
    size: pageSize,
    totalItem: filtered.length,
    totalPage,
  }

  return {
    flows: items,
    allFlows: all,
    paging,
    loading,
    error,
    goToPage: setPage,
    refetch: () => void load(),
  }
}

import { useCallback, useEffect, useState } from 'react'
import * as tagService from '@/services/tag.service'
import { resolveApiError } from '@/lib/apiError'
import type { Paging } from '@/types/api'
import type { Tag } from '@/types/tag'

interface UseTagsOptions {
  deviceId?: string
  search?: string
  pageSize?: number
}

/**
 * Daftar tag. Endpoint tag menerima filter dan paginasi (`TagFilterDto`), jadi
 * keduanya dikirim ke server — beda dari master-tables/storage-flow yang harus
 * dipaginasi di klien.
 */
export function useTags({ deviceId, search, pageSize = 20 }: UseTagsOptions = {}) {
  const [tags, setTags] = useState<Tag[]>([])
  const [paging, setPaging] = useState<Paging | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true)
      setError(null)
      try {
        const result = await tagService.fetchTags({
          deviceId: deviceId || undefined,
          searchTerm: search || undefined,
          page: targetPage,
          pageSize,
        })
        setTags(result.items)
        setPaging(result.paging)
        setPage(result.paging.page)
      } catch (err) {
        setError(resolveApiError(err, 'Gagal memuat daftar tag'))
        setTags([])
        setPaging(null)
      } finally {
        setLoading(false)
      }
    },
    [deviceId, search, pageSize],
  )

  useEffect(() => {
    void load(1)
  }, [load])

  return {
    tags,
    paging,
    page,
    loading,
    error,
    goToPage: (target: number) => void load(target),
    refetch: () => void load(page),
  }
}

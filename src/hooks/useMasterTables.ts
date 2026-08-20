import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE } from '@/config/app'
import * as masterTableService from '@/services/master-table.service'
import { resolveApiError } from '@/lib/apiError'
import type { Paging } from '@/types/api'
import type { MasterTable } from '@/types/master-table'

/**
 * `GET /api/master-tables` mengembalikan SELURUH daftar tanpa filter dan tanpa
 * paging (lihat catatan di service). Jadi pencarian dan paginasi dikerjakan di
 * sini, dari satu salinan data yang sama.
 *
 * Ini pilihan yang sadar, bukan kelalaian: jumlah tabel dinamis pada satu
 * gateway berada di orde puluhan, dan memaksa paginasi server berarti menambah
 * endpoint di backend untuk keuntungan yang tidak terasa. Kalau daftarnya kelak
 * tumbuh ke ribuan, yang perlu berubah hanya hook ini — halaman pemakainya
 * sudah bicara dalam istilah `paging` yang sama.
 */
export function useMasterTables(search = '', pageSize = PAGE_SIZE) {
  const [all, setAll] = useState<MasterTable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setAll(await masterTableService.fetchMasterTables())
    } catch (err) {
      setError(resolveApiError(err, 'Gagal memuat daftar tabel'))
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
      (table) =>
        table.name.toLowerCase().includes(term) ||
        table.tableName.toLowerCase().includes(term) ||
        (table.description ?? '').toLowerCase().includes(term),
    )
  }, [all, search])

  // Kata kunci baru mengubah jumlah halaman; tetap berada di halaman 5 dari
  // hasil yang kini hanya 2 halaman berarti menatap tabel kosong.
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
    tables: items,
    allTables: all,
    paging,
    loading,
    error,
    goToPage: setPage,
    refetch: () => void load(),
  }
}

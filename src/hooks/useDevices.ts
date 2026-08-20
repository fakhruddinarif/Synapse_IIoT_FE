import { useCallback, useEffect, useState } from 'react'
import { PAGE_SIZE } from '@/config/app'
import * as deviceService from '@/services/device.service'
import { resolveApiError } from '@/lib/apiError'
import type { Paging } from '@/types/api'
import type { Device, Protocol } from '@/types/device'

interface UseDevicesOptions {
  protocol?: Protocol
  search?: string
  pageSize?: number
}

/**
 * Daftar perangkat — satu-satunya sumber yang benar-benar dipaginasi backend
 * (`DeviceFilterDto`), jadi filter dan halaman dikirim sebagai query params dan
 * total diambil dari `paging`.
 *
 * Berganti protokol atau kata kunci berarti query yang berbeda: totalnya sudah
 * spesifik ke filter itu, sehingga selalu dimulai dari halaman 1 — kalau tidak,
 * operator yang sedang di halaman 4 akan mendarat di halaman kosong.
 */
export function useDevices({ protocol, search, pageSize = PAGE_SIZE }: UseDevicesOptions = {}) {
  const [devices, setDevices] = useState<Device[]>([])
  const [paging, setPaging] = useState<Paging | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true)
      setError(null)
      try {
        const result = await deviceService.fetchDevices({
          protocol,
          search: search || undefined,
          page: targetPage,
          pageSize,
        })
        setDevices(result.items)
        setPaging(result.paging)
        setPage(result.paging.page)
      } catch (err) {
        setError(resolveApiError(err, 'Gagal memuat daftar perangkat'))
        setDevices([])
        setPaging(null)
      } finally {
        setLoading(false)
      }
    },
    [protocol, search, pageSize],
  )

  useEffect(() => {
    void load(1)
  }, [load])

  return {
    devices,
    paging,
    page,
    loading,
    error,
    goToPage: (target: number) => void load(target),
    refetch: () => void load(page),
  }
}

/** Daftar ringkas untuk dropdown/checkbox pemilih perangkat — tanpa paginasi,
 *  karena form Storage Flow perlu melihat semuanya sekaligus. */
export function useAllDevices(enabled = true) {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setLoading(true)

    deviceService
      .fetchDevices({ page: 1, pageSize: 200 })
      .then((result) => {
        if (!cancelled) setDevices(result.items)
      })
      .catch(() => {
        if (!cancelled) setDevices([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return { devices, loading }
}

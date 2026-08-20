import api from '@/lib/axios'
import { toStorageFlow, unwrapOne } from './adapters'
import type { ApiResponse } from '@/types/api'
import type {
  CreateStorageFlowRequest,
  DiscoveredField,
  StorageFlow,
  UpdateStorageFlowRequest,
} from '@/types/storage-flow'

type Raw = Record<string, unknown>

/**
 * Seperti master-tables, `GET /api/storage-flow` mengembalikan seluruh daftar
 * tanpa filter dan tanpa `paging` — pencarian dan paginasi ditangani klien
 * (lihat `useStorageFlows`).
 */
export async function fetchStorageFlows(): Promise<StorageFlow[]> {
  const { data } = await api.get<ApiResponse<Raw[]>>('/storage-flow')
  return (data.data ?? []).map(toStorageFlow)
}

export async function fetchStorageFlowById(id: string): Promise<StorageFlow> {
  const { data } = await api.get<ApiResponse<Raw>>(`/storage-flow/${id}`)
  return unwrapOne(data, toStorageFlow)
}

export async function createStorageFlow(
  payload: CreateStorageFlowRequest,
): Promise<StorageFlow> {
  const { data } = await api.post<ApiResponse<Raw>>('/storage-flow', payload)
  return unwrapOne(data, toStorageFlow)
}

export async function updateStorageFlow(
  id: string,
  payload: UpdateStorageFlowRequest,
): Promise<StorageFlow> {
  const { data } = await api.put<ApiResponse<Raw>>(`/storage-flow/${id}`, payload)
  return unwrapOne(data, toStorageFlow)
}

export async function deleteStorageFlow(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/storage-flow/${id}`)
}

/**
 * Menanyakan ke backend path apa saja yang tersedia dari respons terakhir
 * sebuah perangkat. Ini yang membuat sourcePath tidak perlu diketik buta —
 * gagalnya bukan error fatal: form tetap bisa menerima path yang ditulis
 * manual.
 */
export async function discoverFields(deviceId: string): Promise<DiscoveredField[]> {
  const { data } = await api.post<ApiResponse<DiscoveredField[]>>('/storage-flow/discover-fields', {
    deviceId,
  })
  return data.data ?? []
}

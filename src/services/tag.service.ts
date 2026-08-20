import api from '@/lib/axios'
import { toTag, unwrapList, unwrapOne } from './adapters'
import type { ApiResponse, PaginatedResult } from '@/types/api'
import type { CreateTagRequest, Tag, TagFilter, UpdateTagRequest } from '@/types/tag'

type Raw = Record<string, unknown>

/** Backend menamai parameter pencarian tag `searchTerm`, bukan `search` seperti
 *  endpoint device — perbedaan yang mudah terlewat dan membuat filternya diam
 *  saja tanpa error. */
function toParams(filter: TagFilter): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (filter.deviceId) params.deviceId = filter.deviceId
  if (filter.searchTerm) params.searchTerm = filter.searchTerm
  if (filter.dataType) params.dataType = filter.dataType
  params.page = filter.page ?? 1
  params.pageSize = filter.pageSize ?? 50
  return params
}

export async function fetchTags(filter: TagFilter = {}): Promise<PaginatedResult<Tag>> {
  const { data } = await api.get<ApiResponse<Raw[]>>('/tags', { params: toParams(filter) })
  return unwrapList(data, toTag, filter)
}

/** Endpoint khusus per perangkat — dipakai form Storage Flow untuk menawarkan
 *  tag sebagai sourcePath pada protokol MODBUS/OPC UA. */
export async function fetchTagsByDevice(deviceId: string): Promise<Tag[]> {
  const { data } = await api.get<ApiResponse<Raw[]>>(`/tags/device/${deviceId}`)
  return (data.data ?? []).map(toTag)
}

export async function fetchTagById(id: string): Promise<Tag> {
  const { data } = await api.get<ApiResponse<Raw>>(`/tags/${id}`)
  return unwrapOne(data, toTag)
}

export async function createTag(payload: CreateTagRequest): Promise<Tag> {
  const { data } = await api.post<ApiResponse<Raw>>('/tags', payload)
  return unwrapOne(data, toTag)
}

export async function updateTag(id: string, payload: UpdateTagRequest): Promise<Tag> {
  const { data } = await api.put<ApiResponse<Raw>>(`/tags/${id}`, payload)
  return unwrapOne(data, toTag)
}

export async function deleteTag(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/tags/${id}`)
}

import api from '@/lib/axios'
import { toDevice, unwrapList, unwrapOne } from './adapters'
import type { ApiResponse, PaginatedResult } from '@/types/api'
import type {
  CreateDeviceRequest,
  Device,
  DeviceFilter,
  UpdateDeviceRequest,
} from '@/types/device'

type Raw = Record<string, unknown>

/**
 * Filter dikirim sebagai query params. Nilai kosong dibuang, bukan dikirim
 * sebagai string kosong — `?search=` membuat backend memfilter dengan pola
 * kosong dan bukan mengabaikan filternya.
 */
function toParams(filter: DeviceFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.name) params.name = filter.name
  if (filter.description) params.description = filter.description
  if (filter.protocol) params.protocol = filter.protocol
  if (filter.search) params.search = filter.search
  if (filter.isEnabled !== undefined) params.isEnabled = filter.isEnabled
  params.page = filter.page ?? 1
  params.pageSize = filter.pageSize ?? 10
  return params
}

export async function fetchDevices(filter: DeviceFilter = {}): Promise<PaginatedResult<Device>> {
  const { data } = await api.get<ApiResponse<Raw[]>>('/device', { params: toParams(filter) })
  return unwrapList(data, toDevice, filter)
}

export async function fetchDeviceById(id: string): Promise<Device> {
  const { data } = await api.get<ApiResponse<Raw>>(`/device/${id}`)
  return unwrapOne(data, toDevice)
}

export async function createDevice(payload: CreateDeviceRequest): Promise<Device> {
  const { data } = await api.post<ApiResponse<Raw>>('/device', payload)
  return unwrapOne(data, toDevice)
}

export async function updateDevice(id: string, payload: UpdateDeviceRequest): Promise<Device> {
  const { data } = await api.put<ApiResponse<Raw>>(`/device/${id}`, payload)
  return unwrapOne(data, toDevice)
}

export async function deleteDevice(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/device/${id}`)
}

export interface HttpProbeResult {
  requestUrl: string
  requestMethod: string
  responseStatusCode: number
  responseData?: unknown
  isSuccess: boolean
  errorMessage?: string
}

/**
 * Menguji endpoint HTTP sebelum perangkatnya disimpan. Berguna dua kali: untuk
 * memastikan URL-nya benar, dan untuk melihat bentuk respons aslinya — dari
 * situlah daftar sourcePath pada Storage Flow diturunkan.
 */
export async function testHttpConnection(payload: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): Promise<HttpProbeResult> {
  const { data } = await api.post<ApiResponse<HttpProbeResult>>(
    '/device/test-http-connection',
    payload,
  )
  if (!data.data) throw new Error(data.message || 'Uji koneksi gagal')
  return data.data
}

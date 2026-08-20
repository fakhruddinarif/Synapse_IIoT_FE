import api from '@/lib/axios'
import { toMasterTable, toMasterTableField, unwrapOne } from './adapters'
import type { ApiResponse } from '@/types/api'
import type {
  CreateMasterTableFieldRequest,
  CreateMasterTableRequest,
  MasterTable,
  MasterTableField,
  UpdateMasterTableFieldRequest,
  UpdateMasterTableRequest,
} from '@/types/master-table'

type Raw = Record<string, unknown>

/**
 * `GET /api/master-tables` TIDAK menerima query params dan TIDAK mengembalikan
 * `paging` — `MasterTableController.GetAll()` memanggil `GetAllAsync()` tanpa
 * argumen. Jadi endpoint ini mengembalikan seluruh daftar, dan pencarian serta
 * paginasi dilakukan di sisi klien (lihat `useMasterTables`).
 *
 * Kode FE lama mengirim `?search=&page=&pageSize=` lalu membaca
 * `response.pagingInfo` — keduanya tidak ada, sehingga filternya tidak pernah
 * berpengaruh dan paginasinya selalu berhenti di satu halaman tanpa error.
 */
export async function fetchMasterTables(): Promise<MasterTable[]> {
  const { data } = await api.get<ApiResponse<Raw[]>>('/master-tables')
  return (data.data ?? []).map(toMasterTable)
}

export async function fetchMasterTableById(id: string): Promise<MasterTable> {
  const { data } = await api.get<ApiResponse<Raw>>(`/master-tables/${id}`)
  return unwrapOne(data, toMasterTable)
}

export async function createMasterTable(
  payload: CreateMasterTableRequest,
): Promise<MasterTable> {
  const { data } = await api.post<ApiResponse<Raw>>('/master-tables', payload)
  return unwrapOne(data, toMasterTable)
}

/** `UpdateMasterTableDto` tidak punya properti `fields`. Mengirimkannya tidak
 *  menambah kolom apa pun — kolom dikelola lewat endpoint field di bawah. */
export async function updateMasterTable(
  id: string,
  payload: UpdateMasterTableRequest,
): Promise<MasterTable> {
  const { data } = await api.put<ApiResponse<Raw>>(`/master-tables/${id}`, payload)
  return unwrapOne(data, toMasterTable)
}

export async function deleteMasterTable(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/master-tables/${id}`)
}

/* --------------------------------- fields --------------------------------- */

export async function fetchFields(masterTableId: string): Promise<MasterTableField[]> {
  const { data } = await api.get<ApiResponse<Raw[]>>(`/master-tables/${masterTableId}/fields`)
  return (data.data ?? []).map(toMasterTableField)
}

export async function createField(
  masterTableId: string,
  payload: CreateMasterTableFieldRequest,
): Promise<MasterTableField> {
  const { data } = await api.post<ApiResponse<Raw>>(
    `/master-tables/${masterTableId}/fields`,
    payload,
  )
  return unwrapOne(data, toMasterTableField)
}

export async function updateField(
  masterTableId: string,
  fieldId: string,
  payload: UpdateMasterTableFieldRequest,
): Promise<MasterTableField> {
  const { data } = await api.put<ApiResponse<Raw>>(
    `/master-tables/${masterTableId}/fields/${fieldId}`,
    payload,
  )
  return unwrapOne(data, toMasterTableField)
}

export async function deleteField(masterTableId: string, fieldId: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/master-tables/${masterTableId}/fields/${fieldId}`)
}

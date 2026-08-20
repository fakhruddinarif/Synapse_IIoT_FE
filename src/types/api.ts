/**
 * Envelope wajib dari Synapse_IIoT_BE (`Core/DTOs/ApiResponse.cs`, dipakai di
 * setiap controller):
 *
 *   { status, message, data, paging?, error? }
 *
 * `paging` hanya hadir pada endpoint list yang dipaginasi. `error` berisi
 * string atau array string saat gagal, dan `null` saat sukses.
 */
export interface ApiResponse<T> {
  status: number
  message: string
  data?: T
  paging?: Paging
  error?: unknown
}

/**
 * `Core/DTOs/PagingInfo.cs`. Perhatikan namanya: backend mengirim `totalPage`
 * dan `totalItem` (tunggal) di bawah kunci `paging` — bukan `pagingInfo` dengan
 * `totalPages`/`totalRecords` seperti yang diasumsikan kode FE lama, yang
 * membuat seluruh paginasi diam-diam berhenti di satu halaman.
 */
export interface Paging {
  size: number
  page: number
  totalPage: number
  totalItem: number
}

/**
 * Bentuk hasil paginasi setelah envelope dibuka — dipakai semua service list
 * supaya komponen tidak perlu tahu soal `ApiResponse` sama sekali.
 */
export interface PaginatedResult<T> {
  items: T[]
  paging: Paging
}


import { isAxiosError } from 'axios'

/**
 * Envelope gagal dari backend: `{ status, message, error }`. `error` bisa
 * berupa string tunggal (pesan exception) atau array string (daftar error
 * validasi ModelState) — keduanya dinormalkan di sini supaya pemanggil tidak
 * perlu bercabang.
 */
interface ErrorEnvelope {
  message?: string
  error?: unknown
}

function normalizeDetails(error: unknown): string[] {
  if (Array.isArray(error)) return error.map(String)
  if (typeof error === 'string' && error.trim()) return [error]
  return []
}

/** Pesan siap tampil dari respons backend, jatuh ke `fallback` kalau bentuknya
 *  tidak dikenali. */
export function resolveApiError(error: unknown, fallback: string): string {
  if (isAxiosError<ErrorEnvelope>(error)) {
    // Tidak ada `response` berarti request tidak pernah sampai: gateway mati
    // atau kabel jaringan pabrik terputus. Itu keluhan yang berbeda dari
    // "backend menolak", dan operator perlu tahu bedanya.
    if (!error.response) return fallback
    const data = error.response.data
    const details = normalizeDetails(data?.error)
    if (details.length > 0) return details.join(', ')
    return data?.message ?? fallback
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

/** `true` kalau request tidak pernah mencapai backend. */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}

export function isUnauthorized(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401
}

/** Daftar error validasi, untuk ditampilkan per-baris di form. */
export function validationDetails(error: unknown): string[] {
  if (!isAxiosError<ErrorEnvelope>(error)) return []
  return normalizeDetails(error.response?.data?.error)
}

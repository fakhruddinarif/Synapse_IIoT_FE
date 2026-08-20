import api from '@/lib/axios'
import { toAuthUser } from './adapters'
import type { ApiResponse } from '@/types/api'
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/user'

type Raw = Record<string, unknown>

/**
 * Login tidak mengembalikan token: backend memasang cookie HTTP-only
 * `JWT-TOKEN` pada respons, dan yang sampai ke FE hanya profil user. Karena itu
 * tidak ada yang perlu disimpan ke localStorage selain profil untuk tampilan.
 */
export async function login(payload: LoginRequest): Promise<AuthUser> {
  const { data } = await api.post<ApiResponse<Raw>>('/auth/login', payload)
  if (!data.data) throw new Error(data.message || 'Login gagal')
  return toAuthUser(data.data)
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  const { data } = await api.post<ApiResponse<Raw>>('/auth/register', {
    username: payload.username,
    password: payload.password,
    role: payload.role ?? 'VIEWER',
  })
  if (!data.data) throw new Error(data.message || 'Registrasi gagal')
  return toAuthUser(data.data)
}

/** Verifikasi sesi. 401 dari sini adalah satu-satunya bukti sah bahwa cookie
 *  sudah tidak berlaku. */
export async function fetchProfile(): Promise<AuthUser> {
  const { data } = await api.get<ApiResponse<Raw>>('/auth/info')
  if (!data.data) throw new Error(data.message || 'Sesi tidak valid')
  return toAuthUser(data.data)
}

export async function logout(): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/logout')
}

/** `Core/Enums/UserRole.cs`. Backend menyerialkan enum sebagai STRING
 *  (`JsonStringEnumConverter` di Program.cs), jadi tipenya union string —
 *  bukan angka. */
export type UserRole = 'ADMIN' | 'ENGINEER' | 'OPERATOR' | 'VIEWER'

export interface AuthUser {
  id: string
  username: string
  role: UserRole
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  role?: UserRole
}

/** Kunci i18n label role — dipusatkan supaya setiap layar memakai label yang
 *  sama dan penambahan role tidak menyisakan ternary yang salah melabeli. */
export function roleLabelKey(role: UserRole): string {
  return `role.${role.toLowerCase()}`
}

/* ---------------------------------------------------------------------------
   Kapabilitas per role. Dipakai guard rute maupun tombol aksi, supaya UI tidak
   menawarkan tombol yang pasti ditolak backend.
--------------------------------------------------------------------------- */

/** Boleh mengubah konfigurasi OT/IT (device, tag, tabel, storage flow). */
export function canWrite(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN' || role === 'ENGINEER'
}

/** Boleh menghapus — hanya ADMIN, sesuai kebijakan role di backend. */
export function canDelete(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN'
}

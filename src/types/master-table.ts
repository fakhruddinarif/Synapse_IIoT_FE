/* ---------------------------------------------------------------------------
   IT LAYER — tabel dinamis. Pengguna mendefinisikan skema tabel di UI, backend
   membuat tabel fisiknya di database. `name` adalah label manusia, `tableName`
   adalah identitas fisik di database (dan tidak bisa diganti sembarangan
   setelah ada data di dalamnya).
--------------------------------------------------------------------------- */

/** `Core/Enums/DataTypeTable.cs`, diserialkan sebagai string. */
export type FieldDataType = 'STRING' | 'INTEGER' | 'FLOAT' | 'BOOLEAN' | 'DATETIME'

export const FIELD_DATA_TYPES: FieldDataType[] = [
  'STRING',
  'INTEGER',
  'FLOAT',
  'BOOLEAN',
  'DATETIME',
]

export const FIELD_DATA_TYPE_LABELS: Record<FieldDataType, string> = {
  STRING: 'String',
  INTEGER: 'Integer',
  FLOAT: 'Float',
  BOOLEAN: 'Boolean',
  DATETIME: 'DateTime',
}

export interface MasterTableField {
  id: string
  name: string
  dataType: FieldDataType
  isEnabled: boolean
  createdAt: string
  updatedAt?: string
}

export interface MasterTable {
  id: string
  name: string
  tableName: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  fields: MasterTableField[]
}

export interface CreateMasterTableFieldRequest {
  name: string
  dataType: FieldDataType
  isEnabled: boolean
}

export interface CreateMasterTableRequest {
  name: string
  tableName: string
  description?: string
  isActive: boolean
  fields: CreateMasterTableFieldRequest[]
}

/** Backend `UpdateMasterTableDto` tidak menerima `fields` — kolom dikelola
 *  lewat endpoint field tersendiri, karena menambah/menghapus kolom berarti
 *  ALTER TABLE pada tabel fisik. */
export interface UpdateMasterTableRequest {
  name?: string
  tableName?: string
  description?: string
  isActive?: boolean
}

export type UpdateMasterTableFieldRequest = Partial<CreateMasterTableFieldRequest>

export interface MasterTableFilter {
  search?: string
  page?: number
  pageSize?: number
}

/** Nama tabel fisik yang aman: huruf kecil, angka, underscore. Dipakai untuk
 *  menyarankan `tableName` dari `name` yang diketik pengguna. */
export function toTableName(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
}

export function isValidTableName(value: string): boolean {
  return /^[a-z][a-z0-9_]{2,59}$/.test(value)
}

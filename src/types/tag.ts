/* ---------------------------------------------------------------------------
   TAG — satu titik ukur pada sebuah perangkat, beserta penskalaan linier dari
   nilai mentah (raw, mis. 0..4095 dari ADC) ke satuan teknis (EU, mis. 0..100
   bar). Skalanya milik tag, bukan milik grafik, supaya nilai yang sama tampil
   identik di dashboard, tabel, maupun ekspor.
--------------------------------------------------------------------------- */

export type TagDataType =
  | 'BOOLEAN'
  | 'INT16'
  | 'UINT16'
  | 'INT32'
  | 'UINT32'
  | 'FLOAT'
  | 'STRING'

export const TAG_DATA_TYPES: TagDataType[] = [
  'BOOLEAN',
  'INT16',
  'UINT16',
  'INT32',
  'UINT32',
  'FLOAT',
  'STRING',
]

export type AccessMode = 'READONLY' | 'READWRITE'

export const ACCESS_MODES: AccessMode[] = ['READONLY', 'READWRITE']

export interface Tag {
  id: string
  deviceId: string
  name: string
  address: string
  dataType: TagDataType
  accessMode: AccessMode
  rawMin: number
  rawMax: number
  euMin: number
  euMax: number
  unit?: string | null
  opcUaNodeId?: string | null
  /** Rasio rentang EU terhadap rentang raw — dihitung backend, hanya untuk
   *  ditampilkan (tidak dipakai menghitung ulang di FE). */
  scalingFactor: number
  createdAt: string
}

export interface CreateTagRequest {
  deviceId: string
  name: string
  address: string
  dataType: TagDataType
  accessMode: AccessMode
  rawMin: number
  rawMax: number
  euMin: number
  euMax: number
  unit?: string
  opcUaNodeId?: string
}

export type UpdateTagRequest = Partial<Omit<CreateTagRequest, 'deviceId'>>

export interface TagFilter {
  deviceId?: string
  searchTerm?: string
  dataType?: TagDataType
  page?: number
  pageSize?: number
}

/* ---------------------------------------------------------------------------
   STORAGE FLOW — jembatan OT → IT. Satu flow mengambil data dari sejumlah
   perangkat, memetakan tiap sumber (JSONPath untuk HTTP/MQTT, path bergaya tag
   untuk MODBUS/OPC UA) ke satu kolom tabel dinamis, lalu menuliskannya setiap
   `storageInterval` milidetik.
--------------------------------------------------------------------------- */

/** Bentuk mapping SAAT DIKIRIM. Backend `CreateStorageFlowMappingDto` hanya
 *  menerima dua field ini — `tagId` sudah dihapus dari skema, dan mengirim
 *  field tak dikenal akan ditolak model binding. */
export interface StorageFlowMappingInput {
  masterTableFieldId: string
  sourcePath: string
}

/** Bentuk mapping SAAT DITERIMA (`StorageFlowMappingDto`). Nama fieldnya
 *  `fieldName`/`fieldDataType`, bukan `masterTableFieldName`. */
export interface StorageFlowMapping {
  id: string
  masterTableFieldId: string
  fieldName: string
  fieldDataType: string
  sourcePath: string
}

export interface StorageFlowDevice {
  deviceId: string
  deviceName: string
  protocol: string
  isEnabled: boolean
}

export interface StorageFlow {
  id: string
  name: string
  description?: string
  isActive: boolean
  storageInterval: number
  masterTableId: string
  masterTableName: string
  devices: StorageFlowDevice[]
  mappings: StorageFlowMapping[]
  createdAt: string
  updatedAt?: string
}

export interface CreateStorageFlowRequest {
  name: string
  description?: string
  isActive: boolean
  storageInterval: number
  masterTableId: string
  deviceIds: string[]
  mappings: StorageFlowMappingInput[]
}

export type UpdateStorageFlowRequest = Partial<CreateStorageFlowRequest>

export interface StorageFlowFilter {
  deviceId?: string
  masterTableId?: string
  search?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

/** Hasil `POST /storage-flow/discover-fields` — daftar path yang benar-benar
 *  ada pada respons terakhir perangkat, supaya sourcePath tidak perlu diketik
 *  buta. */
export interface DiscoveredField {
  path: string
  type: string
  sampleValue?: unknown
}

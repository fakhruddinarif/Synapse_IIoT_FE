import type { ApiResponse, PaginatedResult, Paging } from '@/types/api'
import type { ConnectionConfig, Device, Protocol } from '@/types/device'
import type { MasterTable, MasterTableField, FieldDataType } from '@/types/master-table'
import type {
  StorageFlow,
  StorageFlowDevice,
  StorageFlowMapping,
} from '@/types/storage-flow'
import type { AccessMode, Tag, TagDataType } from '@/types/tag'
import type { AuthUser, UserRole } from '@/types/user'

/* ---------------------------------------------------------------------------
   Satu-satunya tempat bentuk DTO backend diterjemahkan ke tipe FE.

   Dua hal yang selalu perlu dijembatani:

   - Kolom Guid dan DateTime sampai sebagai string; kolom numerik bisa datang
     sebagai string dari beberapa provider. `str()`/`num()` menyamakan keduanya
     supaya komponen tidak pernah melihat `undefined` yang tak terduga.
   - Envelope. Backend membungkus segalanya dalam `{ status, message, data,
     paging }` dan `data` bertipe nullable — komponen tidak boleh perlu tahu
     itu, jadi pembukaannya berhenti di lapisan ini.
--------------------------------------------------------------------------- */

function str(value: unknown, fallback = ''): string {
  return value === null || value === undefined ? fallback : String(value)
}

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function optStr(value: unknown): string | undefined {
  const text = value === null || value === undefined ? '' : String(value)
  return text === '' ? undefined : text
}

type Raw = Record<string, unknown>

/* --------------------------------- envelope -------------------------------- */

/**
 * Membuka envelope daftar. `paging` disintesis dari panjang data kalau backend
 * tidak mengirimnya (endpoint yang belum dipaginasi), supaya komponen paginasi
 * tetap punya bentuk yang sama dan tidak perlu bercabang null.
 */
export function unwrapList<T>(
  response: ApiResponse<Raw[]>,
  map: (raw: Raw) => T,
  requested: { page?: number; pageSize?: number } = {},
): PaginatedResult<T> {
  const items = (response.data ?? []).map(map)
  return { items, paging: response.paging ?? derivePaging(items.length, requested) }
}

function derivePaging(count: number, requested: { page?: number; pageSize?: number }): Paging {
  const size = requested.pageSize ?? count ?? 0
  return {
    page: requested.page ?? 1,
    size,
    totalItem: count,
    totalPage: size > 0 ? Math.max(1, Math.ceil(count / size)) : 1,
  }
}

/** Membuka envelope objek tunggal. `data` null pada respons sukses berarti
 *  kontraknya dilanggar — dilempar di sini daripada dibiarkan menjalar sebagai
 *  `undefined` yang meledak jauh dari sumbernya. */
export function unwrapOne<T>(response: ApiResponse<Raw>, map: (raw: Raw) => T): T {
  if (!response.data) {
    throw new Error(response.message || 'Respons backend tidak memuat data')
  }
  return map(response.data)
}

/* ---------------------------------- auth ---------------------------------- */

export function toAuthUser(raw: Raw): AuthUser {
  return {
    id: str(raw.id),
    username: str(raw.username),
    role: (str(raw.role, 'VIEWER') as UserRole) ?? 'VIEWER',
  }
}

/* --------------------------------- device --------------------------------- */

export function toDevice(raw: Raw): Device {
  return {
    id: str(raw.id),
    name: str(raw.name),
    description: optStr(raw.description),
    isEnabled: Boolean(raw.isEnabled),
    protocol: str(raw.protocol, 'HTTP') as Protocol,
    // `connectionConfig` sengaja diteruskan apa adanya: bentuknya berbeda per
    // protokol dan backend sudah mendeserialkannya ke kelas config yang tepat.
    connectionConfig: (raw.connectionConfig ?? {}) as ConnectionConfig,
    pollingInterval: num(raw.pollingInterval, 1000),
    createdAt: str(raw.createdAt),
    updatedAt: optStr(raw.updatedAt),
  }
}

/* ----------------------------------- tag ---------------------------------- */

export function toTag(raw: Raw): Tag {
  return {
    id: str(raw.id),
    deviceId: str(raw.deviceId),
    name: str(raw.name),
    address: str(raw.address),
    dataType: str(raw.dataType, 'FLOAT') as TagDataType,
    accessMode: str(raw.accessMode, 'READONLY') as AccessMode,
    rawMin: num(raw.rawMin),
    rawMax: num(raw.rawMax, 4095),
    euMin: num(raw.euMin),
    euMax: num(raw.euMax, 100),
    unit: optStr(raw.unit),
    opcUaNodeId: optStr(raw.opcUaNodeId),
    scalingFactor: num(raw.scalingFactor, 1),
    createdAt: str(raw.createdAt),
  }
}

/* ------------------------------ master table ------------------------------ */

export function toMasterTableField(raw: Raw): MasterTableField {
  return {
    id: str(raw.id),
    name: str(raw.name),
    dataType: str(raw.dataType, 'STRING') as FieldDataType,
    isEnabled: Boolean(raw.isEnabled),
    createdAt: str(raw.createdAt),
    updatedAt: optStr(raw.updatedAt),
  }
}

export function toMasterTable(raw: Raw): MasterTable {
  return {
    id: str(raw.id),
    name: str(raw.name),
    tableName: str(raw.tableName),
    description: optStr(raw.description),
    isActive: Boolean(raw.isActive),
    createdAt: str(raw.createdAt),
    updatedAt: optStr(raw.updatedAt),
    fields: ((raw.fields ?? []) as Raw[]).map(toMasterTableField),
  }
}

/* ------------------------------ storage flow ------------------------------ */

function toStorageFlowDevice(raw: Raw): StorageFlowDevice {
  return {
    deviceId: str(raw.deviceId),
    deviceName: str(raw.deviceName),
    protocol: str(raw.protocol),
    isEnabled: Boolean(raw.isEnabled),
  }
}

function toStorageFlowMapping(raw: Raw): StorageFlowMapping {
  return {
    id: str(raw.id),
    masterTableFieldId: str(raw.masterTableFieldId),
    // Backend menamainya `fieldName`/`fieldDataType`. Tipe FE lama memakai
    // `masterTableFieldName`, sehingga kolom tujuan selalu tampil kosong pada
    // daftar Storage Flow.
    fieldName: str(raw.fieldName),
    fieldDataType: str(raw.fieldDataType),
    sourcePath: str(raw.sourcePath),
  }
}

export function toStorageFlow(raw: Raw): StorageFlow {
  return {
    id: str(raw.id),
    name: str(raw.name),
    description: optStr(raw.description),
    isActive: Boolean(raw.isActive),
    storageInterval: num(raw.storageInterval, 1000),
    masterTableId: str(raw.masterTableId),
    masterTableName: str(raw.masterTableName),
    devices: ((raw.devices ?? []) as Raw[]).map(toStorageFlowDevice),
    mappings: ((raw.mappings ?? []) as Raw[]).map(toStorageFlowMapping),
    createdAt: str(raw.createdAt),
    updatedAt: optStr(raw.updatedAt),
  }
}

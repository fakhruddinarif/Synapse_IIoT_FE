/* ---------------------------------------------------------------------------
   OT LAYER — perangkat lapangan dan konfigurasi koneksinya.

   Semua enum di sini adalah union STRING, bukan angka. Backend memasang
   `JsonStringEnumConverter` (Api/Program.cs), jadi `Protocol.HTTP` sampai ke
   FE sebagai `"HTTP"`. Kode lama membandingkannya dengan `4` sehingga tidak
   ada cabang protokol yang pernah cocok.
--------------------------------------------------------------------------- */

export type Protocol = 'MODBUS_TCP' | 'MODBUS_RTU' | 'MQTT' | 'OPC_UA' | 'HTTP'

/** Protokol yang benar-benar sudah dilayani worker backend. Tab pada halaman
 *  Devices hanya menampilkan yang ini — sisanya masih rancangan skema. */
export const SUPPORTED_PROTOCOLS: Protocol[] = ['HTTP', 'MQTT']

export const PROTOCOL_LABELS: Record<Protocol, string> = {
  MODBUS_TCP: 'Modbus TCP',
  MODBUS_RTU: 'Modbus RTU',
  MQTT: 'MQTT',
  OPC_UA: 'OPC UA',
  HTTP: 'HTTP',
}

export interface HttpConfig {
  url: string
  method: string
  headers?: Record<string, string> | null
}

export interface MqttConfig {
  protocol: string
  brokerUrl: string
  port: number
  clientId: string
  topic: string
  username?: string | null
  password?: string | null
  useTls: boolean
}

export interface ModbusTcpConfig {
  ipAddress: string
  port: number
  slaveId: number
  connectionTimeout: number
}

export interface ModbusRtuConfig {
  portName: string
  baudRate: number
  dataBits: number
  stopBits: number
  parity: string
  slaveId: number
}

export interface OpcUaConfig {
  endpointUrl: string
  port: number
  securityPolicy: string
  securityMode: string
  authType: string
  username?: string | null
  password?: string | null
}

export type ConnectionConfig =
  | HttpConfig
  | MqttConfig
  | ModbusTcpConfig
  | ModbusRtuConfig
  | OpcUaConfig

export interface Device {
  id: string
  name: string
  description?: string
  isEnabled: boolean
  protocol: Protocol
  connectionConfig: ConnectionConfig
  pollingInterval: number
  createdAt: string
  updatedAt?: string
}

export interface CreateDeviceRequest {
  name: string
  description?: string
  isEnabled: boolean
  protocol: Protocol
  connectionConfig: ConnectionConfig
  pollingInterval: number
}

export type UpdateDeviceRequest = Partial<CreateDeviceRequest>

export interface DeviceFilter {
  name?: string
  description?: string
  protocol?: Protocol
  search?: string
  isEnabled?: boolean
  page?: number
  pageSize?: number
}

/** Payload realtime dari `DeviceDataHub` (`DeviceDataDto`). Bentuk `data`-nya
 *  bebas — ia adalah respons mentah perangkat, dan itulah yang dipetakan
 *  Storage Flow lewat JSONPath. */
export interface DeviceReading {
  deviceId: string
  deviceName: string
  protocol: string
  data: Record<string, unknown>
  timestamp: string
  status: string
  message?: string | null
}

export function connectionSummary(device: Device): string {
  const config = device.connectionConfig as unknown as Record<string, unknown>
  switch (device.protocol) {
    case 'HTTP':
      return String(config.url ?? '-')
    case 'MQTT':
      return `${config.brokerUrl ?? '-'}:${config.port ?? '-'} → ${config.topic ?? '#'}`
    case 'MODBUS_TCP':
      return `${config.ipAddress ?? '-'}:${config.port ?? '-'} (unit ${config.slaveId ?? '-'})`
    case 'MODBUS_RTU':
      return `${config.portName ?? '-'} @ ${config.baudRate ?? '-'} baud`
    case 'OPC_UA':
      return String(config.endpointUrl ?? '-')
    default:
      return '-'
  }
}

export enum Protocol {
  MODBUS_TCP = 0,
  MODBUS_RTU = 1,
  MQTT = 2,
  OPC_UA = 3,
  HTTP = 4,
}

export const ProtocolLabels: Record<Protocol, string> = {
  [Protocol.MODBUS_TCP]: "Modbus TCP",
  [Protocol.MODBUS_RTU]: "Modbus RTU",
  [Protocol.MQTT]: "MQTT",
  [Protocol.OPC_UA]: "OPC UA",
  [Protocol.HTTP]: "HTTP",
};

export interface HttpConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

export interface MqttConfig {
  protocol: string;
  brokerUrl: string;
  port: number;
  clientId: string;
  topic: string;
  username?: string;
  password?: string;
  useTls: boolean;
}

export interface ModbusTcpConfig {
  host: string;
  port: number;
  unitId: number;
}

export interface ModbusRtuConfig {
  portName: string;
  baudRate: number;
  dataBits: number;
  parity: string;
  stopBits: number;
  unitId: number;
}

export interface OpcUaConfig {
  endpointUrl: string;
  securityMode: string;
  securityPolicy: string;
  username?: string;
  password?: string;
}

export type ConnectionConfig =
  | HttpConfig
  | MqttConfig
  | ModbusTcpConfig
  | ModbusRtuConfig
  | OpcUaConfig;

export interface Device {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  protocol: Protocol;
  connectionConfig: ConnectionConfig;
  pollingInterval: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDeviceDto {
  name: string;
  description?: string;
  isEnabled: boolean;
  protocol: Protocol;
  connectionConfig: ConnectionConfig;
  pollingInterval: number;
}

export interface UpdateDeviceDto {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  protocol?: Protocol;
  connectionConfig?: ConnectionConfig;
  pollingInterval?: number;
}

export interface DeviceFilterDto {
  name?: string;
  description?: string;
  protocol?: Protocol;
  search?: string;
  isEnabled?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PagingInfo {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  pagingInfo?: PagingInfo;
}

export interface DeviceData {
  deviceId: string;
  deviceName: string;
  protocol: Protocol;
  data: any;
  timestamp: string;
  status: string;
  message?: string;
}

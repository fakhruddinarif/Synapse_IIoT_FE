import type { ProtocolType } from "../enums";

/** Connection config for MODBUS TCP devices. */
export interface ModbusTcpConfig {
  host: string;
  port: number;
  unitId: number;
}

/** Connection config for MODBUS RTU devices. */
export interface ModbusRtuConfig {
  portName: string;
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: string;
  unitId: number;
}

/** Connection config for OPC-UA devices. */
export interface OpcUaConfig {
  endpointUrl: string;
  securityMode: string;
  username?: string;
  password?: string;
}

/** Connection config for MQTT devices. */
export interface MqttConfig {
  brokerUrl: string;
  port: number;
  clientId: string;
  username?: string;
  password?: string;
  topic: string;
}

/** Connection config for HTTP devices. */
export interface HttpDeviceConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  authType?: string;
}

/** Union of all supported device connection configs. */
export type ConnectionConfig =
  | ModbusTcpConfig
  | ModbusRtuConfig
  | OpcUaConfig
  | MqttConfig
  | HttpDeviceConfig;

/** Represents a device row from the backend database. */
export interface Device {
  id: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  protocol: ProtocolType;
  connectionConfigJson: string;
  pollingInterval: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

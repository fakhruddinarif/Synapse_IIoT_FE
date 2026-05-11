import { ProtocolType } from "@core/domain/enums";

/** Supported protocol options for selection UIs. */
export const PROTOCOL_OPTIONS = [
  { value: ProtocolType.HTTP, label: "HTTP" },
  { value: ProtocolType.MODBUS_RTU, label: "MODBUS RTU" },
  { value: ProtocolType.MODBUS_TCP, label: "MODBUS TCP" },
  { value: ProtocolType.OPC_UA, label: "OPC-UA" },
  { value: ProtocolType.MQTT, label: "MQTT" },
];

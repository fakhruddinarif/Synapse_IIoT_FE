/** Supported industrial protocol types. */
export const ProtocolType = {
  HTTP: "HTTP",
  MQTT: "MQTT",
  MODBUS_TCP: "MODBUS_TCP",
  MODBUS_RTU: "MODBUS_RTU",
  OPC_UA: "OPC_UA",
} as const;

export type ProtocolType = (typeof ProtocolType)[keyof typeof ProtocolType];

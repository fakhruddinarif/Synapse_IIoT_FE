import { z } from "zod";

const ModbusTcpSchema = z.object({
  ip_address: z
    .string()
    .min(1, "IP Address is required")
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, "Invalid IP address format")
    .refine(
      (ip) => ip.split(".").every((num) => parseInt(num) <= 255),
      "Each IP octet must be between 0-255",
    ),
  port: z.coerce.number().min(1).max(65535).default(502), // 'coerce' mengubah string input ke number
  slave_id: z.coerce.number().min(0).max(255).default(1),
});

const ModbusRtuSchema = z.object({
  port_name: z
    .string()
    .min(1, "COM Port / TTY is required (e.g., COM3, /dev/ttyUSB0)"),
  baud_rate: z.coerce.number().default(9600),
  data_bits: z.coerce.number().default(8),
  parity: z.enum(["none", "even", "odd"]).default("none"),
  stop_bits: z.coerce.number().default(1),
});

const MqttSchema = z.object({
  broker_url: z
    .string()
    .url("Must be a valid URL (e.g., tcp://broker.hivemq.com:1883)"),
  topic: z.string().min(1, "Topic is required"),
  username: z.string().optional(),
  password: z.string().optional(),
});

const HttpSchema = z.object({
  base_url: z.string().url("Must be a valid URL"),
  method: z.enum(["GET", "POST"]).default("GET"),
  headers: z.string().optional(), // Disimpan sebagai JSON string atau key-value array
});

const OpcUaSchema = z
  .object({
    endpoint_url: z
      .string()
      .startsWith("opc.tcp://", "Must start with opc.tcp://"),
    security_policy: z
      .enum(["None", "Basic256Sha256", "Aes128_Sha256_RsaOaep"])
      .default("None"),
    security_mode: z.enum(["None", "Sign", "SignAndEncrypt"]).default("None"),
    auth_type: z.enum(["Anonymous", "Username"]).default("Anonymous"),
    username: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validasi khusus: Jika Auth Type = Username, maka username/password wajib diisi
      if (data.auth_type === "Username" && (!data.username || !data.password)) {
        return false;
      }
      return true;
    },
    {
      message: "Username & Password required for User Auth",
      path: ["username"], // Error muncul di field username
    },
  );

export const DeviceFormSchema = z.object({
  name: z.string().min(3, "Device name must be at least 3 characters"),
  description: z.string().optional(),
  is_enabled: z.boolean().default(false),
  protocol: z.enum(["MODBUS_TCP", "MODBUS_RTU", "MQTT", "HTTP", "OPC_UA"]),
  connection_config: z.union([
    ModbusTcpSchema,
    ModbusRtuSchema,
    MqttSchema,
    HttpSchema,
    OpcUaSchema,
  ]),
});

export type DeviceFormValues = z.infer<typeof DeviceFormSchema>;

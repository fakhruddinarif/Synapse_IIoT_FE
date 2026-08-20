export type ApiPaging = {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

export type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
  paging?: ApiPaging;
  error?: unknown;
};

export type UserInfoDto = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type Protocol = "MODBUS_TCP" | "MODBUS_RTU" | "MQTT" | "OPC_UA" | "HTTP";
export type DataTypeTable =
  | "STRING"
  | "INTEGER"
  | "FLOAT"
  | "BOOLEAN"
  | "DATETIME";
export type DataType =
  | "BOOLEAN"
  | "INT16"
  | "UINT16"
  | "INT32"
  | "UINT32"
  | "FLOAT"
  | "STRING";
export type AccessMode = "READONLY" | "READWRITE";

export type DeviceResponseDto = {
  id: string;
  name: string;
  description?: string | null;
  isEnabled: boolean;
  protocol: Protocol;
  connectionConfig: Record<string, unknown>;
  pollingInterval: number;
  createdAt: string;
  updatedAt?: string | null;
};

export type MasterTableFieldDto = {
  id: string;
  name: string;
  dataType: DataTypeTable;
  isEnabled: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

export type MasterTableDto = {
  id: string;
  name: string;
  tableName: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  fields: MasterTableFieldDto[];
};

export type StorageFlowDeviceDto = {
  deviceId: string;
  deviceName: string;
  protocol: string;
  isEnabled: boolean;
};

export type StorageFlowMappingDto = {
  id: string;
  masterTableFieldId: string;
  fieldName: string;
  fieldDataType: string;
  sourcePath: string;
  tagId?: string | null;
  tagName?: string | null;
};

export type StorageFlowDto = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  masterTableName: string;
  devices: StorageFlowDeviceDto[];
  mappings: StorageFlowMappingDto[];
  createdAt: string;
  updatedAt?: string | null;
};

export type DiscoveredFieldDto = {
  path: string;
  type: string;
  sampleValue?: unknown;
};

export type TagResponseDto = {
  status: number;
  message: string;
  id: string;
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: AccessMode;
  rawMin: number;
  rawMax: number;
  euMin: number;
  euMax: number;
  unit?: string | null;
  opcUaNodeId?: string | null;
  scalingFactor: number;
  createdAt: string;
  isDeleted: boolean;
};

export type FileUploadConfig = {
  allowedExtensions: string[];
  maxFileSize: number;
  maxFileSizeMB: number;
};

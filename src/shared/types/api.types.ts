import type {
  AuditLog,
  Device,
  FileMetadata,
  MasterTable,
  MasterTableField,
  StorageFlow,
  Tag,
  User,
} from "@core/domain/entities";
import type {
  AccessMode,
  DataType,
  FieldDataType,
  ProtocolType,
  UserRole,
} from "@core/domain/enums";

/** Standard API response wrapper. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

/** Paginated response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Login request payload. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Registration request payload. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Auth response payload. */
export interface AuthInfoResponse {
  user: User;
}

/** Device create request. */
export interface CreateDeviceRequest {
  name: string;
  description?: string;
  isEnabled: boolean;
  protocol: ProtocolType;
  connectionConfigJson: string;
  pollingInterval: number;
}

/** Device update request. */
export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {}

/** HTTP connection test request. */
export interface TestHttpConnectionRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

/** Tag create request. */
export interface CreateTagRequest {
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: AccessMode;
  isScaled: boolean;
  rawMin?: number;
  rawMax?: number;
  euMin?: number;
  euMax?: number;
  unit: string;
  isActive: boolean;
  opcUaNodeId?: string;
}

/** Tag update request. */
export interface UpdateTagRequest extends Partial<CreateTagRequest> {}

/** Master table create request. */
export interface CreateMasterTableRequest {
  name: string;
  tableName: string;
  description?: string;
  isActive: boolean;
}

/** Master table field create request. */
export interface CreateMasterTableFieldRequest {
  masterTableId: string;
  name: string;
  dataType: FieldDataType;
  isEnabled: boolean;
}

/** Storage flow create request. */
export interface CreateStorageFlowRequest {
  name: string;
  description?: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  deviceIds: string[];
  mappings: {
    masterTableFieldId: string;
    sourcePath: string;
    tagId?: string;
  }[];
}

/** Storage flow field discovery response. */
export interface DiscoverFieldsResponse {
  fields: string[];
}

/** File upload response. */
export interface FileUploadResponse {
  file: FileMetadata;
}

/** File config response. */
export interface FileConfigResponse {
  maxFileSizeInBytes: number;
  allowedTypes: string[];
}

/** Audit log list response. */
export type AuditLogListResponse = PaginatedResponse<AuditLog>;

/** Master table list response. */
export type MasterTableListResponse = PaginatedResponse<MasterTable>;

/** Storage flow list response. */
export type StorageFlowListResponse = PaginatedResponse<StorageFlow>;

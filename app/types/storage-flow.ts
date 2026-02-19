export interface StorageFlowMapping {
  masterTableFieldId: string;
  masterTableFieldName?: string;
  sourcePath: string;
  tagId?: string;
}

export interface StorageFlowDevice {
  deviceId: string;
  deviceName?: string;
}

export interface StorageFlow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  masterTableName?: string;
  devices: StorageFlowDevice[];
  mappings: StorageFlowMapping[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateStorageFlowDto {
  name: string;
  description?: string;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  deviceIds: string[];
  mappings: StorageFlowMapping[];
}

export interface UpdateStorageFlowDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  storageInterval?: number;
  masterTableId?: string;
  deviceIds?: string[];
  mappings?: StorageFlowMapping[];
}

export interface StorageFlowFilterDto {
  deviceId?: string;
  masterTableId?: string;
  search?: string;
  isActive?: boolean;
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

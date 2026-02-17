export enum DataTypeTable {
  STRING = 0,
  INTEGER = 1,
  FLOAT = 2,
  BOOLEAN = 3,
  DATETIME = 4,
}

export const DataTypeTableLabels: Record<DataTypeTable, string> = {
  [DataTypeTable.STRING]: "String",
  [DataTypeTable.INTEGER]: "Integer",
  [DataTypeTable.FLOAT]: "Float",
  [DataTypeTable.BOOLEAN]: "Boolean",
  [DataTypeTable.DATETIME]: "DateTime",
};

export interface MasterTableField {
  id: string;
  name: string;
  dataType: DataTypeTable;
  isEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MasterTable {
  id: string;
  name: string;
  tableName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  fields: MasterTableField[];
}

export interface CreateMasterTableField {
  name: string;
  dataType: DataTypeTable;
  isEnabled: boolean;
}

export interface CreateMasterTableDto {
  name: string;
  tableName: string;
  description?: string;
  isActive: boolean;
  fields: CreateMasterTableField[];
}

export interface UpdateMasterTableDto {
  name?: string;
  tableName?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateMasterTableFieldDto {
  name?: string;
  dataType?: DataTypeTable;
  isEnabled?: boolean;
}

export interface MasterTableFilterDto {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  pagingInfo?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

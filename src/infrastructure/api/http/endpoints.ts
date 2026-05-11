export const ENDPOINTS = {
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_INFO: "/auth/info",
  AUTH_LOGOUT: "/auth/logout",

  DEVICES: "/device",
  DEVICE_BY_ID: (id: string) => `/device/${id}`,
  DEVICE_HTTP_TEST: "/device/http-test",
  DEVICE_TEST_CONN: "/device/test-http-connection",

  TAGS: "/tags",
  TAG_BY_ID: (id: string) => `/tags/${id}`,
  TAGS_BY_DEVICE: (deviceId: string) => `/tags/device/${deviceId}`,

  MASTER_TABLES: "/master-tables",
  MASTER_TABLE_BY_ID: (id: string) => `/master-tables/${id}`,
  MASTER_TABLE_FIELDS: (masterTableId: string) =>
    `/master-tables/${masterTableId}/fields`,

  STORAGE_FLOWS: "/storage-flow",
  STORAGE_FLOW_BY_ID: (id: string) => `/storage-flow/${id}`,
  STORAGE_FLOW_DISCOVER: "/storage-flow/discover-fields",

  FILE_UPLOAD: "/file/upload",
  FILE_UPLOAD_MULTI: "/file/upload-multiple",
  FILE_UPLOAD_FIELD: "/file/upload-field",
  FILE_DELETE: "/file/delete",
  FILE_CONFIG: "/file/config",

  AUDIT_LOGS: "/audit-logs",
} as const;

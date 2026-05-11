import type { UserRole } from "@core/domain/enums";

/** Permission keys aligned with backend roles. */
export const PERMISSIONS = {
  DEVICE_VIEW: "DEVICE_VIEW",
  DEVICE_EDIT: "DEVICE_EDIT",
  DEVICE_DELETE: "DEVICE_DELETE",
  TAG_VIEW: "TAG_VIEW",
  TAG_WRITE: "TAG_WRITE",
  TAG_CONFIGURE: "TAG_CONFIGURE",
  MASTER_TABLE_VIEW: "MASTER_TABLE_VIEW",
  MASTER_TABLE_EDIT: "MASTER_TABLE_EDIT",
  STORAGE_FLOW_VIEW: "STORAGE_FLOW_VIEW",
  STORAGE_FLOW_EDIT: "STORAGE_FLOW_EDIT",
  FILE_UPLOAD: "FILE_UPLOAD",
  SETTINGS_VIEW: "SETTINGS_VIEW",
  SETTINGS_ADMIN: "SETTINGS_ADMIN",
  USER_MANAGE: "USER_MANAGE",
} as const;

export type Permission = keyof typeof PERMISSIONS;

/** Maps a user role into the permission set used by the UI. */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  switch (role) {
    case "Admin":
      return Object.keys(PERMISSIONS) as Permission[];
    case "Operator":
      return [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.DEVICE_EDIT,
        PERMISSIONS.TAG_VIEW,
        PERMISSIONS.TAG_WRITE,
        PERMISSIONS.TAG_CONFIGURE,
        PERMISSIONS.MASTER_TABLE_VIEW,
        PERMISSIONS.MASTER_TABLE_EDIT,
        PERMISSIONS.STORAGE_FLOW_VIEW,
        PERMISSIONS.STORAGE_FLOW_EDIT,
        PERMISSIONS.FILE_UPLOAD,
        PERMISSIONS.SETTINGS_VIEW,
      ];
    case "Viewer":
    default:
      return [
        PERMISSIONS.DEVICE_VIEW,
        PERMISSIONS.TAG_VIEW,
        PERMISSIONS.MASTER_TABLE_VIEW,
        PERMISSIONS.STORAGE_FLOW_VIEW,
        PERMISSIONS.SETTINGS_VIEW,
      ];
  }
};

import type { AccessMode, DataType } from "../enums";

/** Tag metadata representing a point within a device. */
export interface Tag {
  id: string;
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: AccessMode;
  isScaled: boolean;
  rawMin: number | null;
  rawMax: number | null;
  euMin: number | null;
  euMax: number | null;
  unit: string;
  currentRawValue: number | null;
  currentEngValue: number | null;
  valueUpdatedAt: string | null;
  isActive: boolean;
  opcUaNodeId: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

import type { FieldDataType } from "../enums";

/** Field definition for master tables. */
export interface MasterTableField {
  id: string;
  masterTableId: string;
  name: string;
  dataType: FieldDataType;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

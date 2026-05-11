import type { MasterTableField } from "./MasterTableField";

/** Master table entity. */
export interface MasterTable {
  id: string;
  name: string;
  tableName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  fields?: MasterTableField[];
}

import type { MasterTableField } from "./MasterTableField";
import type { Tag } from "./Tag";

/** Storage flow field mapping entity. */
export interface StorageFlowMapping {
  id: string;
  storageFlowId: string;
  masterTableFieldId: string;
  sourcePath: string;
  tagId: string | null;
  createdAt: string;
  updatedAt: string | null;
  masterTableField?: MasterTableField;
  tag?: Tag;
}

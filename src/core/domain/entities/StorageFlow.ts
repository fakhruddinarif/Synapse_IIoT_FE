import type { MasterTable } from "./MasterTable";
import type { StorageFlowDevice } from "./StorageFlowDevice";
import type { StorageFlowMapping } from "./StorageFlowMapping";

/** Storage flow entity. */
export interface StorageFlow {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  storageInterval: number;
  masterTableId: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  masterTable?: MasterTable;
  devices?: StorageFlowDevice[];
  mappings?: StorageFlowMapping[];
}

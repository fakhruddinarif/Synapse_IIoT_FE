/** File metadata entity. */
export interface FileMetadata {
  id: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  entityType: string;
  entityId: string | null;
  fieldName: string;
  uploadedAt: string;
  deletedAt: string | null;
}

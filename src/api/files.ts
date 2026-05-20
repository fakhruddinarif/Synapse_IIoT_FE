import type { ApiEnvelope, FileUploadConfig } from "../@types/synapse";
import { deleteJson, getJson, postJson } from "./http";

export const getUploadConfig = async () => {
  const response =
    await getJson<ApiEnvelope<FileUploadConfig>>("/api/file/config");
  return response;
};

export const uploadSingleFile = async (
  file: File,
  subDirectory?: string | null,
) => {
  const formData = new FormData();
  formData.append("file", file);

  return postJson<ApiEnvelope<unknown>>("/api/file/upload", formData, {
    query: subDirectory ? { subDirectory } : undefined,
  });
};

export const uploadMultipleFiles = async (
  files: File[],
  subDirectory?: string | null,
) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  return postJson<ApiEnvelope<unknown>>("/api/file/upload-multiple", formData, {
    query: subDirectory ? { subDirectory } : undefined,
  });
};

export const uploadFieldFile = async (
  file: File,
  entityType: string,
  entityId: string,
  fieldName: string,
) => {
  const formData = new FormData();
  formData.append("file", file);

  return postJson<ApiEnvelope<unknown>>("/api/file/upload-field", formData, {
    query: { entityType, entityId, fieldName },
  });
};

export const deleteFile = async (filePath: string) => {
  await deleteJson<ApiEnvelope<null>>("/api/file/delete", {
    query: { filePath },
  });
};

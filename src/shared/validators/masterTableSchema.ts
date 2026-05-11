import { z } from "zod";

/** Zod schema for master table forms. */
export const masterTableSchema = z.object({
  name: z.string().min(2, "Name is required"),
  tableName: z.string().min(2, "Table name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

/** Zod schema for master table field forms. */
export const masterTableFieldSchema = z.object({
  masterTableId: z.string().min(1, "Master table is required"),
  name: z.string().min(1, "Field name is required"),
  dataType: z.string().min(1, "Data type is required"),
  isEnabled: z.boolean(),
});

export type MasterTableFormSchema = z.infer<typeof masterTableSchema>;
export type MasterTableFieldFormSchema = z.infer<typeof masterTableFieldSchema>;

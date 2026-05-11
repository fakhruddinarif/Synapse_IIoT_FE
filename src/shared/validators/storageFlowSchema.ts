import { z } from "zod";

/** Zod schema for storage flow forms. */
export const storageFlowSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  storageInterval: z.number().min(1, "Interval is required"),
  masterTableId: z.string().min(1, "Master table is required"),
  deviceIds: z.array(z.string()).min(1, "Select at least one device"),
  mappings: z
    .array(
      z.object({
        masterTableFieldId: z.string().min(1, "Field is required"),
        sourcePath: z.string().min(1, "Source path is required"),
        tagId: z.string().optional(),
      }),
    )
    .min(1, "Add at least one mapping"),
});

export type StorageFlowFormSchema = z.infer<typeof storageFlowSchema>;

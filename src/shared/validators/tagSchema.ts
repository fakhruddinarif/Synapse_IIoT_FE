import { z } from "zod";

/** Zod schema for tag forms. */
export const tagSchema = z.object({
  deviceId: z.string().min(1, "Device is required"),
  name: z.string().min(2, "Tag name is required"),
  address: z.string().min(1, "Address is required"),
  dataType: z.string().min(1, "Data type is required"),
  accessMode: z.string().min(1, "Access mode is required"),
  isScaled: z.boolean(),
  rawMin: z.number().nullable().optional(),
  rawMax: z.number().nullable().optional(),
  euMin: z.number().nullable().optional(),
  euMax: z.number().nullable().optional(),
  unit: z.string().min(1, "Unit is required"),
  isActive: z.boolean(),
  opcUaNodeId: z.string().nullable().optional(),
});

export type TagFormSchema = z.infer<typeof tagSchema>;

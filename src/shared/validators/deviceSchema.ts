import { z } from "zod";

/** Zod schema for device forms. */
export const deviceSchema = z.object({
  name: z.string().min(2, "Device name is required"),
  description: z.string().optional(),
  isEnabled: z.boolean(),
  protocol: z.string().min(1, "Protocol is required"),
  connectionConfigJson: z.string().min(2, "Connection config is required"),
  pollingInterval: z
    .number()
    .min(100, "Polling interval must be at least 100ms"),
});

export type DeviceFormSchema = z.infer<typeof deviceSchema>;

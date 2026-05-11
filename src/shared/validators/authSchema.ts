import { z } from "zod";

/** Zod schema for authentication forms. */
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;

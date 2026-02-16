import { z } from "zod";

// ============ Enums ============
export const UserRoleSchema = z.enum(["ADMIN", "OPERATOR", "VIEWER"]);

// ============ Request Schemas ============
export const LoginRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  role: UserRoleSchema.optional().default("VIEWER"),
});

// ============ Response Schemas ============
export const UserDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: UserRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: dataSchema,
    error: z.array(z.string()).nullish(),
  });

export const CsrfTokenResponseSchema = ApiResponseSchema(
  z.object({
    csrf_token: z.string(),
  }),
);

export const UserResponseSchema = ApiResponseSchema(UserDtoSchema);

// ============ Type Exports ============
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type CsrfTokenResponse = z.infer<typeof CsrfTokenResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;

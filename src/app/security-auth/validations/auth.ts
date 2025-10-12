import { z } from "zod";
import { AuthErrors } from "../enums/auth-errors.enum";

export const loginSchema = z.object({
  email: z.string().regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    AuthErrors.INVALID_EMAIL
  ),
  password: z.string().min(8, AuthErrors.PASSWORD_TOO_SHORT),
});

export const registerSchema = z.object({
  name: z.string().min(2, ),
  email: z.email(AuthErrors.INVALID_EMAIL),
  password: z
    .string()
    .min(8, AuthErrors.PASSWORD_TOO_SHORT)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      
    )
    .regex(/[^A-Za-z0-9]/, AuthErrors.PASSWORD_SPECIAL_CHAR),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: AuthErrors.PASSWORD_MISMATCH,
  path: ["confirmPassword"]
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
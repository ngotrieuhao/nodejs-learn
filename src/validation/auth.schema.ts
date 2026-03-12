import { isEmailExist } from "services/client/auth.service";
import { z } from "zod";

const emailSchema = z
  .string()
  .email({ message: "Invalid email address" })
  .refine(
    async (email) => {
      const existingUser = await isEmailExist(email);
      return !existingUser;
    },
    {
      message: "Email already exists",
      path: ["email"],
    },
  );

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(25, { message: "Password must be at most 25 characters long" });

export const RegisterSchema = z
  .object({
    id: z.string().optional(),
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Full name must be at least 2 characters long" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TRegisterSchema = z.infer<typeof RegisterSchema>;

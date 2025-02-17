import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().nonempty({ message: "First name is required." }),
    lastName: z.string().nonempty({ message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const logInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const confirmResetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
});

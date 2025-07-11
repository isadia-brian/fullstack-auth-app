import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const NewUserSchema = z.object({
  name: z.string().min(3, "Please input more than one name"),
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    error: "Password should be more than 8 characters",
  }),
  role: z
    .enum(["user", "supervisor", "administrator"])
    .default("user")
    .optional(),
});

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH, "Invalid password"),
});

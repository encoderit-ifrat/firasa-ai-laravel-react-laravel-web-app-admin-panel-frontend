import * as z from "zod";

export const FormSchema = z
  .object({
    email: z.string(),
    token: z.string(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password is too long"),

    password_confirmation: z.string(),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    {
      message: "Passwords do not match",
      path: ["password_confirmation"], 
    }
  );

export type TFormSchema = z.infer<typeof FormSchema>;

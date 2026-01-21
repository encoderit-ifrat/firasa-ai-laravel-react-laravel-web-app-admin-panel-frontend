import { z } from "zod";

export const AdminFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

export type TAdminFormSchema = z.infer<typeof AdminFormSchema>;

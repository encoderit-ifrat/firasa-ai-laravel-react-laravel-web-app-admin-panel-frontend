import { z } from "zod";

export const AdminFormSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  roles: z.array(z.number()).min(1, "At least one role is required"),
});

export type TAdminFormSchema = z.infer<typeof AdminFormSchema>;

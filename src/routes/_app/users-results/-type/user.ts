import { z } from "zod";

export const UserSchema = z.object({
 name: z.string().optional(),
    email: z.string().optional(),
   gender:z.string().optional(),
  datetime: z.string().min(1, "Please select a date and time"),
});

export type TUserSchema = z.infer<typeof UserSchema>;

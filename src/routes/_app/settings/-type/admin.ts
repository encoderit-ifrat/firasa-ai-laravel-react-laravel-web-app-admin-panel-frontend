// import { z } from "zod";

// export const AdminSchema = z.object({
//   name: z.string(),
//   email: z.email(),
//   role: z.literal("admin"),
// });

// export type TAdminSchema = z.infer<typeof AdminSchema>;


import { z } from "zod";



export const AdminSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  email: z.email(),
  roles: z.array(z.number()).min(1, "At least one role is required")
});

export type TAdminSchema = z.infer<typeof AdminSchema>;


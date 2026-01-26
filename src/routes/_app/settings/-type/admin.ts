// import { z } from "zod";

// export const AdminSchema = z.object({
//   name: z.string(),
//   email: z.email(),
//   role: z.literal("admin"),
// });

// export type TAdminSchema = z.infer<typeof AdminSchema>;


import { z } from "zod";

export const RoleEnum = z.enum(["admin", "user", "moderator"]);


export const AdminSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  email: z.email(),
  role: RoleEnum,
});

export type TAdminSchema = z.infer<typeof AdminSchema>;


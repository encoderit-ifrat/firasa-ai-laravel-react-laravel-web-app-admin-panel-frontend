import * as z from "zod";

// Optional: TypeScript enum for gender
// export enum Gender {
//   Male = "male",
//   Female = "female",
//   Other = "other",
// }

// User form schema
export const UserFormSchema = z.object({
  name: z.string().optional(),
    email: z.string().optional(),
   gender:z.string().optional(),
  datetime: z.string().min(1, "Please select a date and time"),
});

export type TUserFormSchema = z.infer<typeof UserFormSchema>;

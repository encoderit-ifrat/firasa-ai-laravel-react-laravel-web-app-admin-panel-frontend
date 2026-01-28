import { z } from "zod";

export const UsersResultsSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  plan: z.string().nullable(),
  analysis_taken_count: z.number(),
  last_analysis_date: z.string().nullable(),
  last_device_used: z.string().nullable(),
  status: z.string(),
});

export type TUsersResultsSchema = z.infer<typeof UsersResultsSchema>;

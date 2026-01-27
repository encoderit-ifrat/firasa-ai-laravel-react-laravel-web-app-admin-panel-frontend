// import { z } from "zod";

// export const SearchSchema = z.object({
//   page: z.number().catch(1),
//   per_page: z.number().catch(5),
//   search: z.string().optional().catch(""),
//   order_by:z.string().optional().catch("id"),
//   order:z.string().optional().catch("desc"),

// });
// export type TSearchSchema = z.infer<typeof SearchSchema>;

import { z } from "zod";

export const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  search: z.string().default(""),
  order_by: z.string().default("id"),
  order: z.string().default("desc"),
});

export type TSearchSchema = z.infer<typeof SearchSchema>;

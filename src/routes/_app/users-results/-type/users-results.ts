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

// Schema for individual user reports (analysis results)
export const UserReportSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().optional(),
  analysis_id: z.string(),
  user_id: z.number(),
  job_id: z.string(),
  device_used: z.string(),
  personality_type: z.string(),
  confidence_score: z.string(),
  is_public: z.boolean(),
  is_full_report: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  full_result: z.object({
    success: z.boolean().optional(),
    insights: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
  free_result: z.object({
    insights: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
});

export type TUserReportSchema = z.infer<typeof UserReportSchema>;

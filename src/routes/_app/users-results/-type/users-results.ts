import { z } from "zod";

export const UsersResultsSchema = z.object({
  job_id: z.string(),
  status: z.string(),
  result: z.object({
    ocean_scores: z.object({
      openness: z.number(),
      conscientiousness: z.number(),
      extraversion: z.number(),
      agreeableness: z.number(),
      neuroticism: z.number(),
    }),

    deep_insights: z.object({
      openness: z.string(),
      conscientiousness: z.string(),
      extraversion: z.string(),
      agreeableness: z.string(),
      neuroticism: z.string(),
    }),

    strengths_weaknesses: z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
    }),

    growth_plan: z.object({
      short_term: z.array(z.string()),
      mid_term: z.array(z.string()),
      long_term: z.array(z.string()),
    }),

    career_match: z.object({
      recommended_roles: z.array(z.string()),
      work_style: z.string(),
    }),

    confidence_score: z.number(),
  }),
});

export type TUsersResultsSchema = z.infer<typeof UsersResultsSchema>;

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

const MetricGroupSchema = z.object({
  metrics: z.record(z.string(), z.object({
    level: z.string(),
    score: z.number(),
    description: z.string(),
  })).optional(),
  strength: z.object({ title: z.string(), description: z.string() }).optional(),
  tradeoff: z.object({ title: z.string(), description: z.string() }).optional(),
  growth_lever: z.string().optional(),
  suitable_for: z.array(z.string()).optional(),
  actionable_steps: z.array(z.object({ text: z.string(), emoji: z.string() })).optional(),
  snapshot_insight: z.string().optional(),
  behavioral_patterns: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  coach_recommendation: z.string().optional(),
  how_others_experience: z.string().optional(),
  indicators: z.record(z.string(), z.object({
    level: z.string(),
    score: z.number(),
    signals: z.array(z.string()),
  })).optional(),
  interpretations: z.record(z.string(), z.string()).optional(),
});

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
    summary: z.object({
      mean_t_score: z.number().optional(),
      total_traits: z.number().optional(),
      subdued_traits: z.array(z.string()).optional(),
      dominant_traits: z.array(z.string()).optional(),
      category_distribution: z.record(z.string(), z.number()).optional(),
    }).optional(),
    insights: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      quote: z.string().optional(),
      story: z.string().optional(),
      tags: z.array(z.object({
        emoji: z.string(),
        label: z.string(),
      })).optional(),
      story_traits: z.array(z.object({
        emoji: z.string(),
        label: z.string(),
      })).optional(),
    }).optional(),
    interpretations: z.record(z.string(), z.object({
      label: z.string(),
      t_score: z.number(),
      category: z.string(),
      raw_score: z.number(),
      percentile: z.number(),
      interpretation: z.string(),
    })).optional(),
    work_metrics: MetricGroupSchema.optional(),
    audio_metrics: MetricGroupSchema.optional(),
    stress_metrics: MetricGroupSchema.optional(),
    learning_metrics: MetricGroupSchema.optional(),
    openness_metrics: MetricGroupSchema.optional(),
    creativity_metrics: MetricGroupSchema.optional(),
    relationship_metrics: MetricGroupSchema.optional(),
  }).nullable().optional(),
  free_result: z.object({
    insights: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      quote: z.string().optional(),
      story: z.string().optional(),
      tags: z.array(z.object({
        emoji: z.string(),
        label: z.string(),
      })).optional(),
      story_traits: z.array(z.object({
        emoji: z.string(),
        label: z.string(),
      })).optional(),
    }).optional(),
  }).nullable().optional(),
});

export type TUserReportSchema = z.infer<typeof UserReportSchema>;

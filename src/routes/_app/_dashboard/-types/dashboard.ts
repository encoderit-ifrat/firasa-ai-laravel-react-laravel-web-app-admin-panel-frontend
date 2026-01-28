import { z } from "zod";

// ============================================================================
// DASHBOARD SCHEMAS
// ============================================================================

// Monthly Service Chart Schema
const MonthlyServiceChartSchema = z.object({
  total: z.string(),
  pending_count: z.string(),
  assigned_count: z.string(),
  live_count: z.string(),
  completed_count: z.string(),
  incomplete_count: z.string(),
  month: z.string(),
  month_name: z.string(),
  year: z.string(),
  status_label: z.string().nullable(),
});

// Weekly Service Chart Schema
const WeeklyServiceChartSchema = z.object({
  total: z.string(),
  pending_count: z.string(),
  assigned_count: z.string(),
  live_count: z.string(),
  completed_count: z.string(),
  incomplete_count: z.string(),
  day: z.string(),
  day_name: z.string(),
  month: z.string(),
  month_name: z.string(),
  year: z.string(),
  created_at: z.string(),
  status_label: z.string().nullable(),
});

// Dashboard Data Schema
const DashboardDataSchema = z.object({
  total_client: z.number().int(),
  total_supervisor: z.number().int(),
  total_commissioned_officer: z.number().int(),
  total_non_commissioned_officer: z.number().int(),
  total_service: z.number().int(),
  total_pending_service: z.number().int(),
  total_assigned_service: z.number().int(),
  total_live_service: z.number().int(),
  total_completed_service: z.number().int(),
  total_incomplete_service: z.number().int(),
  monthly_service_chart: z.array(MonthlyServiceChartSchema),
  weekly_service_chart: z.array(WeeklyServiceChartSchema),
});

// Root Dashboard Response Schema
export const DashboardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: DashboardDataSchema,
});

// Dashboard Types
export type TDashboardResponse = z.infer<typeof DashboardResponseSchema>;
export type TDashboardData = z.infer<typeof DashboardDataSchema>;
export type TMonthlyServiceChart = z.infer<typeof MonthlyServiceChartSchema>;
export type TWeeklyServiceChart = z.infer<typeof WeeklyServiceChartSchema>;

// Dashboard Overview Schema (for /dashboard/overview endpoint)
export const DashboardOverviewSchema = z.object({
  total_users: z.number(),
  completed_tests: z.number(),
  upgraded_to_pro: z.number(),
  conversion_rate: z.number(),
  range: z.string(),
});

export type TDashboardOverview = z.infer<typeof DashboardOverviewSchema>;

// Dashboard Users Distribution Schema (for /dashboard/users-distribution endpoint)
export const DashboardUsersDistributionSchema = z.object({
  free: z.number(),
  pro: z.number(),
  subscribers: z.number(),
  range: z.string(),
});

export type TDashboardUsersDistribution = z.infer<typeof DashboardUsersDistributionSchema>;

// Dashboard Conversion Funnel Schema (for /dashboard/conversion-funnel endpoint)
export const DashboardConversionFunnelSchema = z.object({
  visitors: z.number(),
  test_started: z.number(),
  test_completed: z.number(),
  upgraded: z.number(),
  range: z.string(),
});

export type TDashboardConversionFunnel = z.infer<typeof DashboardConversionFunnelSchema>;

// ============================================================================
// PERSONALITY ASSESSMENT SCHEMAS
// ============================================================================

// Ocean Scores Schema
const OceanScoresSchema = z.object({
  openness: z.number(),
  conscientiousness: z.number(),
  extraversion: z.number(),
  agreeableness: z.number(),
  neuroticism: z.number(),
});

// Deep Insights Schema
const DeepInsightsSchema = z.object({
  openness: z.string(),
  conscientiousness: z.string(),
  extraversion: z.string(),
  agreeableness: z.string(),
  neuroticism: z.string(),
});

// Strengths and Weaknesses Schema
const StrengthsWeaknessesSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

// Growth Plan Schema
const GrowthPlanSchema = z.object({
  short_term: z.array(z.string()),
  mid_term: z.array(z.string()),
  long_term: z.array(z.string()),
});

// Career Match Schema
const CareerMatchSchema = z.object({
  recommended_roles: z.array(z.string()),
  work_style: z.string(),
});

// Result Schema
const ResultSchema = z.object({
  ocean_scores: OceanScoresSchema,
  deep_insights: DeepInsightsSchema,
  strengths_weaknesses: StrengthsWeaknessesSchema,
  growth_plan: GrowthPlanSchema,
  career_match: CareerMatchSchema,
  confidence_score: z.number(),
});

// Root Personality Assessment Response Schema
export const PersonalityAssessmentResponseSchema = z.object({
  job_id: z.string().uuid(),
  status: z.string(),
  result: ResultSchema,
});

// Personality Assessment Types
export type TPersonalityAssessmentResponse = z.infer<typeof PersonalityAssessmentResponseSchema>;
export type TResult = z.infer<typeof ResultSchema>;
export type TOceanScores = z.infer<typeof OceanScoresSchema>;
export type TDeepInsights = z.infer<typeof DeepInsightsSchema>;
export type TStrengthsWeaknesses = z.infer<typeof StrengthsWeaknessesSchema>;
export type TGrowthPlan = z.infer<typeof GrowthPlanSchema>;
export type TCareerMatch = z.infer<typeof CareerMatchSchema>;
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../../../../axios";
import type { TSearchSchema } from "../../../../../types/search";

type TReportResult = {
    job_id: string;
    status: string;
    result: {
        ocean_scores: {
            openness: number;
            conscientiousness: number;
            extraversion: number;
            agreeableness: number;
            neuroticism: number;
        };
        deep_insights: {
            openness: string;
            conscientiousness: string;
            extraversion: string;
            agreeableness: string;
            neuroticism: string;
        };
        strengths_weaknesses: {
            strengths: string[];
            weaknesses: string[];
        };
        growth_plan: {
            short_term: string[];
            mid_term: string[];
            long_term: string[];
        };
        career_match: {
            recommended_roles: string[];
            work_style: string;
        };
        confidence_score: number;
    };
};

type TProps = {
    reportId: string | undefined;
    params?: TSearchSchema;
    options?: Omit<
        UseQueryOptions<TReportResult, Error, TReportResult>,
        "queryKey" | "queryFn"
    >;
};

export const useGetUserReport = ({ reportId, params, options }: TProps) => {
    return useQuery({
        ...options,
        queryKey: ["user-reports", reportId],
        queryFn: async (): Promise<TReportResult> => {
            const response = await api.post(`/user-results/report/${reportId}`, params || {});

            // Handle different response structures
            return response.data.data || response.data;
        },
        enabled: !!reportId && (options?.enabled ?? true),
    });
};
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TDashboardOverview } from "../../-types/dashboard";
import { api } from "../../../../../axios";

type TApiResponse = TDashboardOverview;

type TRangeParam = "daily" | "monthly" | "yearly" | "last_7_days" | "all";

type TProps = {
    params?: {
        range?: TRangeParam;
    };
    options: Omit<
        UseQueryOptions<
            TApiResponse,
            Error,
            TApiResponse

        >,
        "queryKey" | "queryFn"
    >;
};

export const useGetDashboardOverview = ({ params, options }: TProps) => {
    const { range } = params || {};

    return useQuery({
        ...options,
        queryKey: ["dashboard", "overview", range],
        queryFn: async (): Promise<TApiResponse> => {
            const response = await api.get("/dashboard/overview", {
                params: {
                    range,
                },
            });

            return response.data.data;
        },
    });
};
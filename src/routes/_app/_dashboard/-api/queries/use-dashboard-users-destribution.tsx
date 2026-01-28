import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "../../../../../axios";
import type { TDashboardUsersDistribution } from "../../-types/dashboard";

type TApiResponse = TDashboardUsersDistribution;

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

export const useGetDashboardDistribution = ({ params, options }: TProps) => {
    const { range } = params || {};

    return useQuery({
        ...options,
        queryKey: ["dashboard", "users-distribution", range],
        queryFn: async (): Promise<TApiResponse> => {
            const response = await api.get("/dashboard/users-distribution", {
                params: {
                    range,
                },
            });

            return response.data.data;
        },
    });
};
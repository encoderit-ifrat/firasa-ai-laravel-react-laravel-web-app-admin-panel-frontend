import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TDashboardConversionFunnel } from "../../-types/dashboard";
import { api } from "../../../../../axios";



type TApiResponse = TDashboardConversionFunnel;

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

export const useGetDashboardConversionFunnel = ({ params, options }: TProps) => {
    const { range } = params || {};

    return useQuery({
        ...options,
        queryKey: ["dashboard", "conversion-funnel", range],
        queryFn: async (): Promise<TApiResponse> => {
            const response = await api.get("/dashboard/conversion-funnel", {
                params: {
                    range,
                },
            });

            return response.data.data;
        },
    });
};

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type { TMetaSchema } from "../../../../../types/meta";

import { api } from "../../../../../axios";
import type { TSearchSchema } from "../../../../../types/search";
import type { TUserReportSchema } from "../../-type/users-results";




type TApiResponse = {
    data: TUserReportSchema[];
    meta: TMetaSchema;
};

type TProps = {
    userId: number,
    params: TSearchSchema & {

        status?: number;
        order_by?: string,
        order?: string,
        plan?: string,
    },

    options: Omit<
        UseQueryOptions<
            TApiResponse,
            Error,
            TApiResponse

        >,
        "queryKey" | "queryFn"
    >;
};

export const useGetUserReports = ({ userId, params, options }: TProps) => {
    const { page, per_page, search, order_by, order, plan } = params;

    return useQuery({
        ...options,
        queryKey: ["user-reports", userId, page, per_page, search, order_by, order, plan],
        queryFn: async (): Promise<TApiResponse> => {
            const response = await api.post(`/user-results/reports/${userId}`, params);

            // response.data contains { data: [...], meta: {...} }
            return response.data.data;
        },
    });
};

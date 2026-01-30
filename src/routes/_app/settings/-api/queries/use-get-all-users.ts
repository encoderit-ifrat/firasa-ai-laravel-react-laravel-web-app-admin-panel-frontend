
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TAdminSchema } from "../../-type/admin";
import type { TMetaSchema } from "../../../../../types/meta";

import { api } from "../../../../../axios";
import type { TSearchSchema } from "../../../../../types/search";



type TApiResponse = {
  data: TAdminSchema[];
  meta: TMetaSchema;
};

type TProps = {
  params: TSearchSchema & {
    status?: number;
    order_by?: string,
    order?: string,
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

export const useGetAllUsers = ({ params, options }: TProps) => {

  const { page, per_page, search, order_by, order } = params;


  return useQuery({
    ...options,
    queryKey: ["users", page, per_page, search, order_by, order],
    queryFn: async (): Promise<TApiResponse> => {
      const response = await api.get("/users", { params });
      return response.data.data;
    },
  });
};

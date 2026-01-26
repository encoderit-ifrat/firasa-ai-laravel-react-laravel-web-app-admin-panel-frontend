
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TAdminSchema } from "../../-type/admin";
import type { TMetaSchema } from "../../../../../types/meta";
import type { TSearchSchema } from "../../../../../types/search";
import { api } from "../../../../../axios";



type TApiResponse = {
  data: TAdminSchema[];
  meta: TMetaSchema;
};

type TProps = {
  params: TSearchSchema & {
      status?: number;
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
  const { page, per_page, search} = params;

  return useQuery({
    ...options,
    queryKey: ["users", page, per_page, search],
    queryFn: async (): Promise<TApiResponse> => {
      const response = await api.get("/users", { params });

      const {
        data: { data },
      } = response;
      return data;
    },
  });
};

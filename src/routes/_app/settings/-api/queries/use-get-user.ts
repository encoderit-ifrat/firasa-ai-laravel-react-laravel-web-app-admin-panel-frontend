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
  params?: TSearchSchema; // Made optional since you're not using it
  id: string | number;
  options?: Omit
    UseQueryOptions<TAdminSchema, Error, TAdminSchema>, 
    "queryKey" | "queryFn"
  >;
};

export const useGetUser = ({ id, options }: TProps) => {
  return useQuery({
    ...options,
    queryKey: ["admin", id],
    queryFn: async () => {
      const admin = await api.get(`/users/${id}`);
      console.log("🚀 ~ useGetAdmin ~ admin:", admin);
      const {
        data: { data },
      } = admin;
      return data; // This should be a single TAdminSchema object
    },
  });
};
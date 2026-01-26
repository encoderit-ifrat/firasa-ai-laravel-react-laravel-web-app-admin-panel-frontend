import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TAdminSchema } from "../../-type/admin";
import { api } from "../../../../../axios";




type TProps = {
  id: string | number;
  options: Omit<
    UseQueryOptions<
      TAdminSchema,
      Error,
      TAdminSchema,
      ["users", string | number]
    >,
    "queryKey" | "queryFn"
  >;
};
export const useGetUser = ({ id, options }: TProps) => {
  return useQuery({
    ...options,
    queryKey: ["users", id],
    queryFn: async () => {
      const users = await api.get(`/users/${id}`);
      console.log("🚀 ~ useGetUser ~ users:", users)
      const {
        data: { data },
      } = users;
      return data;
    },
  });
};



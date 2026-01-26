
import { useQuery } from "@tanstack/react-query";
import { omitEmpty } from "../../../../../lib/omit-empties";
import { api } from "../../../../../axios";
type GetAllUsersProps = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export const useGetAllRoleDropdown = ({
  enabled = true,
  refetchOnMount = true,
}: GetAllUsersProps) => {
  // const { getParams } = useManageUrl();
  // const { page, search, branch_id } = getParams;

  const omitEmptyParams = omitEmpty({
    // ...getParams,
    // per_page: SEARCH_PARAMS.per_page,
  });

  const query = useQuery({
    queryKey: ["get-role-dropdown-query", omitEmptyParams],
    enabled,
    refetchOnMount,
      queryFn: async () => {
    
      return (
        await api.get(`/roles`, {
          params: omitEmptyParams,
        })
      ).data?.data;
    },
  });
  
  return { ...query };
};

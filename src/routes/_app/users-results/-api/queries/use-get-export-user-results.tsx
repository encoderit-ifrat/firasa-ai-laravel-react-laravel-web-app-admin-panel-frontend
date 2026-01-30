import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../../../../axios";

type TExportUserResult = {
  // Define your export user result type here based on your API response
  // Example:
  id: number;
  // Add other fields as needed
};

type TExportUserResultsResponse = {
  data: TExportUserResult[];
  // Add other response fields like pagination metadata if needed
};

type TExportUserResultsParams = {
  ids?: string | number | (string | number)[];
  status?: string;
  search?: string;
  plan?: string | string[];
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: "asc" | "desc";
};

type TProps = {
  params: TExportUserResultsParams;
  options?: Omit<
    UseQueryOptions<
      TExportUserResultsResponse,
      Error,
      TExportUserResultsResponse
    >,
    "queryKey" | "queryFn"
  >;
};

export const useGetExportUserResults = ({ params, options }: TProps) => {
  return useQuery({
    ...options,
    queryKey: ["export-user-results", params],
    queryFn: async (): Promise<TExportUserResultsResponse> => {
      const response = await api.get("/export-user-results", {
        params,
      });
      console.log("🚀 ~ useGetExportUserResults ~ response:", response);
      return response.data;
    },
  });
};
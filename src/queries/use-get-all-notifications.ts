
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TSearchSchema } from "../types/search";
import { api } from "../axios";


export interface NotificationData {
  id: string;
  type: string;
  title?: string;
  message?: string;
  data: {
    title?: string;
    message?: string;
    user_id?: number | string;
    [key: string]: any;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationResponse {
  success?: boolean;
  message?: string;
  unread_count?: number;
  total?: number;
  meta?: any;
  data:
  | NotificationData[]
  | {
    data: NotificationData[];
    unread_count?: number;
    total?: number;
    meta?: any;
  };
}

type TProps = {
  params: TSearchSchema & {
    role?: string;
  };

  options: Omit<
    UseQueryOptions<NotificationResponse, Error, NotificationResponse>,
    "queryKey" | "queryFn"
  >;
};

export const useGetAllNotifications = ({ params, options }: TProps) => {
  const { page, per_page, role, search } = params;

  return useQuery({
    ...options,
    queryKey: ["notifications", page, per_page, role, search],
    queryFn: async (): Promise<NotificationResponse> => {
      const response = await api.get<NotificationResponse>("/user/notifications", { params });
      return response.data as NotificationResponse;
    },
  });
};

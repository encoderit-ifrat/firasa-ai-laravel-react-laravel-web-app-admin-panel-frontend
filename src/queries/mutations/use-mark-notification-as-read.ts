import { useMutation, useQueryClient } from "@tanstack/react-query";

import { isAxiosError } from "axios";
import { toast } from "sonner";
import { api } from "../../axios";
import type { NotificationResponse } from "../use-get-all-notifications";


interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-notification-as-read"],
    mutationFn: async (id: string): Promise<MarkAsReadResponse> => {
      const response = await api.post<MarkAsReadResponse>(
        `/user/notifications/${id}/read`
      );
      return response.data as MarkAsReadResponse;
    },
    onSuccess: async (_data, id) => {
      try {
        // Update all cached "notifications" queries in-place to mark the specific notification as read
        const queries = queryClient.getQueriesData<NotificationResponse>({ queryKey: ["notifications"] });
        queries.forEach(([queryKey, cached]) => {
          if (!cached) return;

          // Shallow clone the cached value to avoid mutating react-query internals
          const next = JSON.parse(JSON.stringify(cached)) as NotificationResponse;

          let changed = false;
          let list: any[] = [];
          const existingData = next.data;

          if (Array.isArray(existingData)) {
            list = existingData;
          } else if (existingData && typeof existingData === 'object' && Array.isArray(existingData.data)) {
            list = existingData.data;
          }

          for (let i = 0; i < list.length; i++) {
            const n = list[i];
            if (n.id === id && !n.read_at && !n.is_read) {
              n.read_at = new Date().toISOString();
              n.is_read = true;
              changed = true;
            }
          }

          if (changed) {
            // decrease unread_count safely
            next.unread_count = Math.max(0, (next.unread_count || 0) - 1);
            if (next.meta) {
              next.meta.unread_count = Math.max(0, (next.meta.unread_count || 0) - 1);
            }

            if (!Array.isArray(next.data) && next.data && typeof next.data === 'object') {
              next.data.unread_count = Math.max(0, (next.data.unread_count || 0) - 1);
              if (next.data.meta) {
                next.data.meta.unread_count = Math.max(0, (next.data.meta.unread_count || 0) - 1);
              }
            }

            // update the cache for this specific query key
            queryClient.setQueryData(queryKey, next);
          }
        });

        // Also invalidate to ensure eventually consistent with server
        await queryClient.refetchQueries({ queryKey: ["notifications"] });
      } catch (err) {
        // If anything goes wrong updating the cache, as a fallback invalidate the notifications queries
        await queryClient.refetchQueries({ queryKey: ["notifications"] });
      }
    },
    onError: (error) => {
      const fallback = "Failed to mark notification as read.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};

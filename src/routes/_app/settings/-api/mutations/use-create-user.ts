import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TAdminFormSchema } from "../../-type/admin-form";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { omitEmpty } from "../../../../../lib/omit-empties";
import { api } from "../../../../../axios";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-admin"],

    // API call
    mutationFn: (body: TAdminFormSchema) => {
      return api.post("/users", omitEmpty(body));
    },

    // Success handling
    onSuccess: async () => {
      toast.success("Admin created successfully!");

      // Refetch the admin list to get updated data
      await queryClient.refetchQueries({
        queryKey: ["all-admins"],
      });
    },

    // Error handling
    onError: (error) => {
      const fallback = "Failed to create admin.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};

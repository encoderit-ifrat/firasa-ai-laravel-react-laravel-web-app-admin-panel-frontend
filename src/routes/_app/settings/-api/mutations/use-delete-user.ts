
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { TAdminFormSchema } from "../../-type/admin-form";
import { api } from "../../../../../axios";



export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["/user"],
    mutationFn: ({ id }: Pick<TAdminFormSchema, "id">) =>
      api.delete(`/users/${id}`),

    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      const fallback = "Failed to delete user.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};

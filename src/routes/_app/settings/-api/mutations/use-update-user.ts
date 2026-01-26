import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { TAdminSchema } from "../../-type/admin";
import { api } from "../../../../../axios";
import { omitEmpty } from "../../../../../lib/omit-empties";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-user"],

    mutationFn: ({ id, ...body }: TAdminSchema & { id: number | string }) => {
      const data = omitEmpty({
        ...body,
        _method: "PUT",
      });

      return api.post(`/users/${id}`, data);
    },

    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      const fallback = "Failed to update user.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};
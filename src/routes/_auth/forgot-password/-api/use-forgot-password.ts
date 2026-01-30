import { toast } from "sonner";
import { api } from "../../../../axios";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

type TForgotPasswordBody = {
  email: string;
  redirect_url: string;
};

export const useForgotPassword = () => {


  return useMutation({
    mutationKey: ["/password/forgot"],
    mutationFn: (body: TForgotPasswordBody) =>
      api.post("/password/forgot", body),

    onSuccess: () => {
    
      toast.success("Check Your Email Please!")
     
    },

    onError: (error) => {
      const fallback = "Failed to send reset link.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};

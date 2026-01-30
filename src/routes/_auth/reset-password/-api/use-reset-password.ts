import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";

     
type TResetPasswordBody ={
    token:string;
    email:string;
    password:string;
    password_confirmation:string;
}


export const useResetPassword = () => {
    const navigate = useNavigate();
  return useMutation({
    mutationKey: ["/password/reset"],
    mutationFn: (body:TResetPasswordBody) => 
        api.post("/password/reset", body),
    onSuccess: () => {
          toast.success("Your password has been reset.");
          navigate( { to :"/login", search:{code:undefined}});
        },
        onError:(error) => {
          const fallback = "Failed to reset password.";
                if (isAxiosError(error)) {
                  toast.error(error.response?.data?.message || error.message || fallback);
                } else {
                  toast.error("Something went wrong.");
                }
        },
    
  });
 
};    
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { TFormSchema } from "../-type";
import { omitEmpty } from "../../../../lib/omit-empties";
import { api } from "../../../../axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["/login"],
    mutationFn: (body: TFormSchema) => {
      const data = omitEmpty(body);
      return api.post("/auth/login", data);
    },
    onSuccess: (res) => {
      const {
        data: { data },
      } = res;
      const { token, user } = data;
   
      console.log("user", user);

      if (!user?.is_admin) {
        toast.error("Wrong email password !");
        return;
      }

    

      if (token?.access_token) {
        localStorage.setItem("token", token.access_token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate({ to: "/", replace: true });
        toast.success("Logged in successfully!");
      } else {
        toast.error("Invalid response from server");
      }
    },

    onError: (error) => {
      const fallback = "Failed to log in.";
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || fallback);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });
};




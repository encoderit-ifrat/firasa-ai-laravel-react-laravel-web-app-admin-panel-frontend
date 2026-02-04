import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { TFormSchema } from "../-type/form";
import { omitEmpty } from "../../../../lib/omit-empties";
import { api } from "../../../../axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ["/register"],
        mutationFn: (body: TFormSchema) => {
            const data = omitEmpty(body);
            return api.post("/auth/register", data);
        },
        onSuccess: (res) => {
            const {
                data: { data },
            } = res;
            const { token, user } = data;
            if (token?.access_token) {
                localStorage.setItem("token", token.access_token);
                localStorage.setItem("user", JSON.stringify(user));
                navigate({ to: "/", replace: true });
                toast.success("Account created successfully!");
            } else {
                // If the backend doesn't automatically log in after registration, 
                // we might just want to redirect to login.
                // But following the login logic, it seems they expect a token.
                toast.success("Registration successful! Please log in.");
                navigate({ to: "/login" });
            }
        },
        onError: (error) => {
            const fallback = "Failed to register.";
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message || fallback);
            } else {
                toast.error("Something went wrong.");
            }
        },
    });
};

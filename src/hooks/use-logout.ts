import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../axios";
import { toast } from "sonner";

export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            return api.post("/logout");
        },
        onSuccess: () => {
            localStorage.clear();
            navigate({ to: "/login", replace: true });
            toast.success("Logged out successfully");
        },
        onError: (error: any) => {
            console.error("Logout failed", error);
            // Even if the API call fails, we should probably clear local storage and redirect
            localStorage.clear();
            navigate({ to: "/login", replace: true });
            toast.error("Logout performed with errors");
        },
    });
};

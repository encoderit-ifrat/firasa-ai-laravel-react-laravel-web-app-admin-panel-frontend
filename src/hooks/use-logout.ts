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
      const preservedLang = localStorage.getItem("language");
      localStorage.clear();
      if (preservedLang) {
        localStorage.setItem("language", preservedLang);
      }
      navigate({ to: "/login", replace: true });
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      console.error("Logout failed", error);
      const preservedLang = localStorage.getItem("language");
      localStorage.clear();
      if (preservedLang) {
        localStorage.setItem("language", preservedLang);
      }
      navigate({ to: "/login", replace: true });
      toast.error("Logout performed with errors");
    },
  });
};

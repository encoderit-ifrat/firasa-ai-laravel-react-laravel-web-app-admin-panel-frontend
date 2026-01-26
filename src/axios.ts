import axios from "axios";
import { API_BASE_URL } from "./consts";
import { toast } from "sonner";
// import { useLogout } from "./hooks/use-logout";
// import { useAuth } from "@/store/use-auth";
// const theme = localStorage.getItem("theme");

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // const { logout } = useLogout();
    if (error.response?.status === 401) {
      // logout();
      // await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.clear();
      // localStorage.setItem("theme", theme || "");
      // setIsLoggingOut(false);
      // navigate({ to: "/login", replace: true });
      window.location.href = "/login";
      toast.success("Logged out successfully");
    }

    return Promise.reject(error);
  }
);

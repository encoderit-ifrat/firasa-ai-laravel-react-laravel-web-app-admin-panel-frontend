import { toast } from "sonner";
import { api } from "../axios";

interface UseExportOptions {
    endpoint: string;
    filename?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export const useExport = () => {
    const exportData = async (options: UseExportOptions, params: any) => {
        const { endpoint, filename = "export.xlsx", onSuccess, onError } = options;

        try {
            toast.info("Preparing export...");

            const response = await api.get(endpoint, {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Export successful");
            onSuccess?.();
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export data");
            onError?.(error);
        }
    };

    return { exportData };
};

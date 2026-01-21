import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/sonner";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "./i18n";

const queryClient = new QueryClient();

export const router = createRouter({ routeTree });

// register router for module augmentation
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </I18nextProvider>
  );
}

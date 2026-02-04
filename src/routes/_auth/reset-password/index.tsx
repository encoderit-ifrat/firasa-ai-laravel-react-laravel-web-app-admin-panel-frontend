import { createFileRoute } from "@tanstack/react-router";
import FormResetPassword from "./-components/form-reset-password";

export const Route = createFileRoute("/_auth/reset-password/")({
  component: RouteComponent,
  validateSearch: (search) => ({
    token: search.token as string | undefined,
    email: search.email as string | undefined,
  }),
});

function RouteComponent() {
  const { email = "", token = "" } = Route.useSearch();

  return <FormResetPassword email={email} token={token} />;
}

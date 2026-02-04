import { createFileRoute } from "@tanstack/react-router";
import FormForgotPassword from "./-components/form-forgot-password";


export const Route = createFileRoute("/_auth/forgot-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FormForgotPassword />;
}

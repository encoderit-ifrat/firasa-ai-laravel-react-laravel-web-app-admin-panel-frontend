import { createFileRoute } from "@tanstack/react-router";
import { FormLogin } from "./-component";


export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (

    <FormLogin />

  );
}

import { createFileRoute } from "@tanstack/react-router";
import { FormRegister } from "./-component/form-register";

export const Route = createFileRoute("/_auth/register/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <FormRegister />;
}

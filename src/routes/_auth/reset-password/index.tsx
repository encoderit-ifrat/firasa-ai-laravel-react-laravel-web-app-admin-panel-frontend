import { createFileRoute } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";
import IconHead from "@/components/svg-icon/icon-head";
import FormResetPassword from "./-components/form-reset-password";



export const Route = createFileRoute("/_auth/reset-password/")({
  component: RouteComponent,
  validateSearch:(search) =>({
    token:search.token as string | undefined,
    email:search.email as string | undefined,
  })
});

function RouteComponent() {
  const { email="", token="" } = Route.useSearch();
  
  // return <FormResetPassword email={email} token = {token} />;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="px-10 w-full max-w-lg mx-auto border-1 border-custom-footer-text-red">
        <div className="flex items-center justify-between mt-12 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-xl text-muted-foreground">to get Started</p>
          </div>
          <IconHead />
        </div>

        <FormResetPassword email={email} token={token} />
      </Card>
    </div>
  );
}

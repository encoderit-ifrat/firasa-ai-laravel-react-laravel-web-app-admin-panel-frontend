import { createFileRoute } from "@tanstack/react-router";
import FormForgotPassword from "./-components/form-forgot-password";
import { Card } from "@/components/ui/card";
import IconHead from "@/components/svg-icon/icon-head";


export const Route = createFileRoute("/_auth/forgot-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="px-10 w-full max-w-lg mx-auto border-1 border-custom-footer-text-red">
        <div className="flex items-center justify-between mt-12 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-xl text-muted-foreground">to get Started</p>
          </div>
          <IconHead />
        </div>

        <FormForgotPassword />
      </Card>
    </div>
  );
}

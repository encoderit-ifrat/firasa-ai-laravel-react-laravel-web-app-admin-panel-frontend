import { createFileRoute } from "@tanstack/react-router";
import { FormLogin } from "./-component";
import { Card } from "@/components/ui/card";
import IconHead from "@/components/svg-icon/icon-head";
export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className=" w-full max-w-lg mx-auto px-10 border-1 border-custom-footer-text-red ">
        <div className="flex items-center justify-between mt-12 mb-8 ">
          <div>
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-xl text-muted-foreground">to get Started</p>
          </div>
          <IconHead />
        </div>

        <FormLogin />
      </Card>
    </div>
  );
}

import { Button } from '../../components/ui/button';
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { CornerDownLeft } from 'lucide-react';

export const Route = createFileRoute('/_auth')({
    component: RouteComponent,
})

function RouteComponent() {
    const token = localStorage.getItem("token");
    const path = useRouterState({
        select: (state) => state.location.pathname,
    });
    console.log("🚀 ~ RouteComponent ~ path:", path);
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const navigate = useNavigate();

    if (Boolean(token) && user?.is_admin === "1") {
        navigate({
            to: "/",
            replace: true
        });
    }

    return (
        <div
            className="min-h-svh flex items-center justify-center relative p-4"
        // style={{
        //     background: "radial-gradient(100% 100% at 48.92% 100%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 224, 27, 0.16) 100%)"
        // }}
        >
            {path != "/login" && (
                <Button
                    variant="outline"
                    asChild
                    size={"icon"}
                    className="absolute top-4 left-4"
                >
                    {/* <Link to="/login">
                        <CornerDownLeft />
                    </Link> */}
                </Button>
            )}
            <div className="w-full flex justify-center">
                <Outlet />
            </div>
        </div>
    );
}

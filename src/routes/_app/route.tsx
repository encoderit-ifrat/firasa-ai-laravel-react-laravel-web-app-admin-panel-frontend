import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { SidebarProvider } from '../../components/ui/sidebar'
import { AppSidebar } from '../../components/app-sidebar'
import Navbar from '../../components/navbar'
import { useEffect } from 'react'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!token || !user?.is_admin) {
      navigate({ to: "/login", replace: true });
    }
  }, [token, user, navigate]);

  return <SidebarProvider>
    <div className="flex h-svh w-full overflow-hidden">
      <div className="max-w-full">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '../../components/ui/sidebar'
import { AppSidebar } from '../../components/app-sidebar'
import Navbar from '../../components/navbar'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <SidebarProvider>
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

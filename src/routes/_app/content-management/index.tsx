import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/content-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/content-management/"!</div>
}

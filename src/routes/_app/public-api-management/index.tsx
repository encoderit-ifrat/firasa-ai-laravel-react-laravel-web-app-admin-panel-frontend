import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/public-api-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/public-api-management/"!</div>
}

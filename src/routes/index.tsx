import { createFileRoute } from "@tanstack/react-router"

import { auctionListSearchSchema } from "@/pages/auction-list"

export const Route = createFileRoute("/")({
  validateSearch: auctionListSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}

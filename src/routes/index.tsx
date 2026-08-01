import { createFileRoute } from "@tanstack/react-router"

import { AuctionListPage, auctionListSearchSchema } from "@/pages/auction-list"

export const Route = createFileRoute("/")({
  validateSearch: auctionListSearchSchema,
  component: AuctionListPage,
})

import { createFileRoute } from "@tanstack/react-router"

import { auctionDetailQueryOptions } from "@/entities/auction"
import {
  AuctionDetailError,
  AuctionDetailLayout,
  AuctionDetailPending,
} from "@/pages/auction-detail"

export const Route = createFileRoute("/auctions/$auctionUuid")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      auctionDetailQueryOptions(params.auctionUuid)
    ),
  component: AuctionDetailLayout,
  pendingComponent: AuctionDetailPending,
  errorComponent: AuctionDetailError,
})

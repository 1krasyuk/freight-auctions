import {
  createFileRoute,
  type SearchSchemaInput,
} from "@tanstack/react-router"

import {
  auctionBetsQueryOptions,
  auctionDetailQueryOptions,
} from "@/entities/auction"
import {
  AuctionBetsError,
  AuctionBetsPage,
  AuctionBetsPending,
  auctionBetsSearchSchema,
  type AuctionBetsSearch,
} from "@/pages/auction-bets"

type AuctionBetsSearchInput = Partial<AuctionBetsSearch> & SearchSchemaInput

function validateAuctionBetsSearch(
  search: AuctionBetsSearchInput
): AuctionBetsSearch {
  return auctionBetsSearchSchema.parse(search)
}

export const Route = createFileRoute("/auctions/$auctionUuid/bets")({
  validateSearch: validateAuctionBetsSearch,
  loader: async ({ context, params }) => {
    const auction = await context.queryClient.ensureQueryData(
      auctionDetailQueryOptions(params.auctionUuid)
    )
    const isHistoryHidden =
      auction.hide_bets_history === true ||
      auction.trading.hide_bets_history === true

    if (isHistoryHidden) {
      return
    }

    return context.queryClient.ensureQueryData(
      auctionBetsQueryOptions(params.auctionUuid, true)
    )
  },
  component: AuctionBetsPage,
  pendingComponent: AuctionBetsPending,
  errorComponent: AuctionBetsError,
})

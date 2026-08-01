import {
  createFileRoute,
  type SearchSchemaInput,
} from "@tanstack/react-router"

import {
  AuctionListPage,
  auctionListSearchSchema,
  type AuctionListSearch,
} from "@/pages/auction-list"

type AuctionListSearchInput = Partial<AuctionListSearch> & SearchSchemaInput

function validateAuctionListSearch(
  search: AuctionListSearchInput
): AuctionListSearch {
  return auctionListSearchSchema.parse(search)
}

export const Route = createFileRoute("/")({
  validateSearch: validateAuctionListSearch,
  component: AuctionListPage,
})

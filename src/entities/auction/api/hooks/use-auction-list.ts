import { useQuery } from "@tanstack/react-query"

import {
  auctionListQueryOptions,
  type AuctionListRequest,
} from "../queries/auction-list-query"

export function useAuctionList(request: AuctionListRequest) {
  return useQuery(auctionListQueryOptions(request))
}

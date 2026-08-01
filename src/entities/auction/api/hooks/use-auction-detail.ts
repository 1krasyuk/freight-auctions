import { useQuery } from "@tanstack/react-query"

import { auctionDetailQueryOptions } from "../queries/auction-detail-query"

export function useAuctionDetail(auctionUuid: string) {
  return useQuery(auctionDetailQueryOptions(auctionUuid))
}

import { queryOptions } from "@tanstack/react-query"

import { api } from "@/shared/api/api"
import type { AuctionShowResponse } from "@/shared/api/generated/Api"

export type AuctionDetail = AuctionShowResponse

export const auctionDetailQueryKey = (auctionUuid: string) =>
  ["auctions", "detail", auctionUuid] as const

export function auctionDetailQueryOptions(auctionUuid: string) {
  return queryOptions({
    queryKey: auctionDetailQueryKey(auctionUuid),
    queryFn: async (): Promise<AuctionShowResponse> => {
      const response = await api.auctions.getAuction(auctionUuid)

      return response.data
    },
    staleTime: 30_000,
  })
}

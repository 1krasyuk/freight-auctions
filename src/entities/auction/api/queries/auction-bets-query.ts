import { queryOptions } from "@tanstack/react-query"

import { api } from "@/shared/api/api"
import type {
  BetItem as AuctionBetDto,
  BetListResponse,
} from "@/shared/api/generated/Api"

export type AuctionBet = AuctionBetDto

export const auctionBetsQueryKey = (auctionUuid: string, all: boolean) =>
  ["auctions", "bets", auctionUuid, { all }] as const

export function auctionBetsQueryOptions(
  auctionUuid: string,
  all = false
) {
  return queryOptions({
    queryKey: auctionBetsQueryKey(auctionUuid, all),
    queryFn: async (): Promise<BetListResponse> => {
      const response = await api.auctions.listBets(
        auctionUuid,
        all ? { all: true } : undefined
      )

      return response.data
    },
  })
}

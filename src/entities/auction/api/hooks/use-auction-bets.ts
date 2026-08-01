import { useQuery } from "@tanstack/react-query"

import { auctionBetsQueryOptions } from "../queries/auction-bets-query"

type UseAuctionBetsOptions = {
  all?: boolean
  enabled?: boolean
}

export function useAuctionBets(
  auctionUuid: string,
  { all = false, enabled = true }: UseAuctionBetsOptions = {}
) {
  return useQuery({
    ...auctionBetsQueryOptions(auctionUuid, all),
    enabled,
  })
}

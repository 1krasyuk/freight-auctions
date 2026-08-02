import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/shared/api/api"
import type { SetBetRequest } from "@/shared/api/generated/Api"

import { auctionDetailQueryKey } from "../queries/auction-detail-query"

export function useSetAuctionBet(auctionUuid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SetBetRequest) =>
      api.auctions.setBet(auctionUuid, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["auctions", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: auctionDetailQueryKey(auctionUuid),
        }),
        queryClient.invalidateQueries({
          queryKey: ["auctions", "bets", auctionUuid],
        }),
      ])
    },
  })
}

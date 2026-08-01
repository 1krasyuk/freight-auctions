import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { api } from "@/shared/api/api"
import type {
  AuctionListItem as AuctionListItemDto,
  AuctionListRequest as AuctionListRequestDto,
  AuctionListResponseBase,
} from "@/shared/api/generated/Api"

export type AuctionListItem = AuctionListItemDto
export type AuctionListRequest = AuctionListRequestDto

export const auctionListQueryKey = (request: AuctionListRequest) =>
  ["auctions", "list", request] as const

export function auctionListQueryOptions(request: AuctionListRequest) {
  return queryOptions({
    queryKey: auctionListQueryKey(request),
    queryFn: async (): Promise<AuctionListResponseBase> => {
      const response = await api.auctions.listAuctions(request)

      return response.data
    },
    placeholderData: keepPreviousData,
  })
}

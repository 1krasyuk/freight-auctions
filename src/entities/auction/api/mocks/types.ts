import type {
  AuctionListItem,
  AuctionShowResponse,
  BetItem,
} from "@/shared/api/generated/Api"

export type MockAuctionRecord = {
  listItem: AuctionListItem
  detail: AuctionShowResponse
  bets: BetItem[]
}

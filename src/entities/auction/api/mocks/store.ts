import { auctionFixtures } from "./fixtures"
import type { MockAuctionRecord } from "./types"

function createAuctionEntry(
  fixture: MockAuctionRecord
): [string, MockAuctionRecord] {
  const detailAuctionUuid = fixture.detail.main.order_uid
  const listAuctionUuid = fixture.listItem.main?.order_uid

  if (!detailAuctionUuid) {
    throw new Error("Auction fixture detail.main.order_uid is required")
  }

  if (detailAuctionUuid !== listAuctionUuid) {
    throw new Error(
      `Auction fixture UUID mismatch: detail=${detailAuctionUuid}, list=${listAuctionUuid}`
    )
  }

  const auctionRecord = structuredClone(fixture)

  return [detailAuctionUuid, auctionRecord]
}

export const auctionStore = new Map<string, MockAuctionRecord>(
  auctionFixtures.map(createAuctionEntry)
)

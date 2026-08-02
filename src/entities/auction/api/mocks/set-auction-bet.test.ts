import { describe, expect, it } from "vitest"

import type { BetItem } from "@/shared/api/generated/Api"
import { activeAuctionFixture } from "./fixtures"
import { setAuctionBet } from "./set-auction-bet"
import type { MockAuctionRecord } from "./types"

function createRecord(): MockAuctionRecord {
  return structuredClone(activeAuctionFixture)
}

function createBet({
  id,
  organizationId,
  subscriberId,
  place,
  price,
  cancelReason = "",
}: {
  id: number
  organizationId: number
  subscriberId: number
  place: number | null
  price: number
  cancelReason?: string
}): BetItem {
  return {
    id,
    organization_id: organizationId,
    subscriber_id: subscriberId,
    place,
    price_with_vat: price,
    cancel_reason: cancelReason,
  }
}

function expectFailureWithoutMutation(
  record: MockAuctionRecord,
  price: number,
  expectedField: "price" | null
) {
  const before = structuredClone(record)
  const result = setAuctionBet(record, { price })

  expect(result.success).toBe(false)
  expect(result).toMatchObject({ field: expectedField })
  expect(record).toEqual(before)
}

describe("setAuctionBet validation", () => {
  it("rejects a bet when trading does not allow it", () => {
    const record = createRecord()
    record.detail.trading.can_set_bet = false

    expectFailureWithoutMutation(record, 27_000, null)
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, 0, -500])(
    "rejects an invalid positive finite price: %s",
    (price) => {
      expectFailureWithoutMutation(createRecord(), price, "price")
    }
  )

  it.each([19_500, 20_250, 30_500])(
    "rejects a price outside min, max or step constraints: %s",
    (price) => {
      expectFailureWithoutMutation(createRecord(), price, "price")
    }
  )
})

describe("setAuctionBet mutation", () => {
  it("creates a new active bet and updates list and detail trading state", () => {
    const record = createRecord()

    const result = setAuctionBet(record, { price: 27_000 })

    expect(result).toEqual({ success: true })
    expect(record.bets).toHaveLength(1)
    expect(record.bets[0]).toMatchObject({
      organization_id: 14,
      subscriber_id: 13,
      price_with_vat: 27_000,
      price_no_vat: 22_500,
      place: 1,
      cancel_reason: "",
    })
    expect(record.detail.trading).toMatchObject({
      status_mobile: "Leading",
      is_bidder: true,
      price: { current: 27_000, current_no_vat: 22_500 },
      your: {
        bet: true,
        last_bet: 27_000,
        last_bet_with_vat: 27_000,
      },
    })
    expect(record.listItem.trading).toMatchObject({
      status_mobile: "Leading",
      is_bidder: true,
      price: { current: 27_000, current_no_vat: 22_500 },
      your: { bet: true, last_bet: 27_000 },
    })
  })

  it("updates the participant active bet and recalculates places", () => {
    const record = createRecord()
    record.bets = [
      createBet({
        id: 10,
        organizationId: 99,
        subscriberId: 99,
        place: 1,
        price: 26_500,
      }),
      createBet({
        id: 11,
        organizationId: 14,
        subscriberId: 13,
        place: 2,
        price: 27_000,
      }),
    ]

    setAuctionBet(record, { price: 26_000 })

    expect(record.bets).toHaveLength(2)
    expect(record.bets.find((bet) => bet.id === 11)).toMatchObject({
      price_with_vat: 26_000,
      place: 1,
    })
    expect(record.bets.find((bet) => bet.id === 10)?.place).toBe(2)
  })

  it("preserves a canceled bet and creates a new active record", () => {
    const record = createRecord()
    const canceledBet = createBet({
      id: 10,
      organizationId: 14,
      subscriberId: 13,
      place: null,
      price: 28_000,
      cancelReason: "Отменена перевозчиком",
    })
    record.bets = [
      canceledBet,
      createBet({
        id: 11,
        organizationId: 99,
        subscriberId: 99,
        place: 1,
        price: 26_500,
      }),
    ]
    const canceledSnapshot = structuredClone(canceledBet)

    setAuctionBet(record, { price: 26_000 })

    expect(record.bets).toHaveLength(3)
    expect(record.bets.find((bet) => bet.id === 10)).toEqual(canceledSnapshot)
    expect(record.bets.find((bet) => bet.id === 12)).toMatchObject({
      organization_id: 14,
      subscriber_id: 13,
      price_with_vat: 26_000,
      place: 1,
      cancel_reason: "",
    })
    expect(record.bets.find((bet) => bet.id === 11)?.place).toBe(2)
  })

  it("updates the newly active bet on the next call without duplicating it", () => {
    const record = createRecord()
    record.bets = [
      createBet({
        id: 10,
        organizationId: 14,
        subscriberId: 13,
        place: null,
        price: 28_000,
        cancelReason: "Отменена перевозчиком",
      }),
    ]

    setAuctionBet(record, { price: 27_000 })
    setAuctionBet(record, { price: 26_500 })

    expect(record.bets).toHaveLength(2)
    expect(record.bets.find((bet) => bet.cancel_reason === "")).toMatchObject({
      price_with_vat: 26_500,
      place: 1,
    })
  })
})

import { describe, expect, it } from "vitest"

import type { AuctionBet } from "@/entities/auction"
import {
  formatBetDate,
  formatPrice,
  getAuctionBetKey,
  getParticipantCount,
  getPriceWithVat,
  getPriceWithoutVat,
  hasAuctionBetDetails,
  sortAuctionBetsByPlace,
} from "./auction-bet-formatters"

describe("auction bet price formatters", () => {
  it("formats a known price and handles a missing value", () => {
    const expected = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(27_000)

    expect(formatPrice(27_000)).toBe(expected)
    expect(formatPrice(null)).toBe("Не указана")
    expect(formatPrice(undefined)).toBe("Не указана")
  })

  it("prefers top-level VAT prices and falls back to price_info", () => {
    const bet: AuctionBet = {
      price_with_vat: 27_000,
      price_no_vat: 22_500,
      price_info: {
        price_with_vat: 26_000,
        price_no_vat: 21_666.67,
      },
    }

    expect(getPriceWithVat(bet)).toBe(27_000)
    expect(getPriceWithoutVat(bet)).toBe(22_500)

    const fallbackBet: AuctionBet = {
      price_info: {
        price_with_vat: 26_000,
        price_no_vat: 21_666.67,
      },
    }

    expect(getPriceWithVat(fallbackBet)).toBe(26_000)
    expect(getPriceWithoutVat(fallbackBet)).toBe(21_666.67)
  })
})

describe("formatBetDate", () => {
  it("splits a valid local date into date and time", () => {
    const result = formatBetDate("2026-05-25T16:05:00")

    expect(result?.date).toContain("25")
    expect(result?.date).toContain("2026")
    expect(result?.time).toBe("16:05")
  })

  it("returns undefined for an absent or invalid date", () => {
    expect(formatBetDate(undefined)).toBeUndefined()
    expect(formatBetDate("not-a-date")).toBeUndefined()
  })
})

describe("auction bet collection helpers", () => {
  it("counts unique organizations and subscriber fallbacks", () => {
    const bets: AuctionBet[] = [
      { organization_id: 10, subscriber_id: 100 },
      { organization_id: 10, subscriber_id: 101, cancel_reason: "Отменена" },
      { subscriber_id: 20 },
      { subscriber_id: 20 },
      {},
    ]

    expect(getParticipantCount(bets)).toBe(2)
  })

  it("sorts places ascending, keeps missing places last and does not mutate", () => {
    const bets: AuctionBet[] = [
      { id: 1, place: null },
      { id: 2, place: 3 },
      { id: 3, place: 1 },
      { id: 4 },
      { id: 5, place: 2 },
    ]
    const original = structuredClone(bets)

    const result = sortAuctionBetsByPlace(bets)

    expect(result.map((bet) => bet.id)).toEqual([3, 5, 2, 1, 4])
    expect(bets).toEqual(original)
  })
})

describe("auction bet details helpers", () => {
  it("detects a meaningful comment or cancellation reason", () => {
    expect(hasAuctionBetDetails({ transporter_comment: "Комментарий" })).toBe(
      true
    )
    expect(hasAuctionBetDetails({ cancel_reason: "Отменена" })).toBe(true)
    expect(
      hasAuctionBetDetails({ transporter_comment: "  ", cancel_reason: "" })
    ).toBe(false)
  })

  it("uses the API id for a key and has a deterministic fallback", () => {
    expect(getAuctionBetKey({ id: 42 }, 0)).toBe("42")
    expect(getAuctionBetKey({ organization_id: 14 }, 3)).toBe("14-3")
    expect(getAuctionBetKey({}, 2)).toBe("unknown-2")
  })
})

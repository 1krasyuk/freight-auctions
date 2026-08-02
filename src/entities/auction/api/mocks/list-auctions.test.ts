import { describe, expect, it } from "vitest"

import type { AuctionListItem } from "@/shared/api/generated/Api"
import {
  createAuctionListResponse,
  validateAuctionListRequest,
} from "./list-auctions"

type ListItemOptions = {
  id: number
  cargoNum?: string
  createdAt?: string
  auctionType?: "Request" | "Up" | "Down" | "FixPrice"
  auctionStatus?: "Planning" | "Auction" | "Finished"
  tradingStatus?: "NotParticipating" | "Leading" | "Losing" | "Winner"
  loadCity?: string
  unloadCity?: string
  loadDate?: string
  isAvailable?: boolean
  isBidder?: boolean
  currentPrice?: number
  pricePerKm?: number
}

function createListItem({
  id,
  cargoNum = `cargo-${id}`,
  createdAt = `2026-05-${String(id).padStart(2, "0")}T12:00:00Z`,
  auctionType = "Down",
  auctionStatus = "Auction",
  tradingStatus = "NotParticipating",
  loadCity = "Казань",
  unloadCity = "Москва",
  loadDate = "2026-05-25T09:00:00Z",
  isAvailable = true,
  isBidder = false,
  currentPrice,
  pricePerKm,
}: ListItemOptions): AuctionListItem {
  return {
    main: {
      id,
      cargo_num: cargoNum,
      order_uid: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
      created_at: createdAt,
      auc_type: auctionType,
      price_per_km: pricePerKm,
    },
    route: {
      load: { city: loadCity, date: loadDate },
      unload: { city: unloadCity },
    },
    trading: {
      status: auctionStatus,
      status_mobile: tradingStatus,
      is_available: isAvailable,
      is_bidder: isBidder,
      price: currentPrice === undefined ? undefined : { current: currentPrice },
    },
  }
}

describe("validateAuctionListRequest", () => {
  it("accepts a valid contract request", () => {
    expect(
      validateAuctionListRequest({
        page: 1,
        per_page: 20,
        status: ["Leading"],
        statuses: [2],
        auc_type: ["Down"],
        load_date_from: "2026-05-25T00:00:00Z",
        current_price_from: 0,
      })
    ).toEqual([])
  })

  it("reports invalid pagination, enums and dates", () => {
    const errors = validateAuctionListRequest({
      page: 0,
      per_page: 1.5,
      status: ["Invalid"],
      statuses: [8],
      auc_type: ["Unknown"],
      load_date_from: "25.05.2026",
    })

    expect(errors.map((error) => error.field)).toEqual(
      expect.arrayContaining([
        "page",
        "per_page",
        "status.0",
        "statuses.0",
        "auc_type.0",
        "load_date_from",
      ])
    )
  })
})

describe("createAuctionListResponse", () => {
  const items = [
    createListItem({
      id: 1,
      cargoNum: "0001",
      createdAt: "2026-05-20T10:00:00Z",
      tradingStatus: "Leading",
      loadCity: "Казань",
      loadDate: "2026-05-25T09:00:00Z",
      isBidder: true,
      currentPrice: 20_000,
      pricePerKm: 20,
    }),
    createListItem({
      id: 2,
      cargoNum: "0002",
      createdAt: "2026-05-21T10:00:00Z",
      auctionType: "Request",
      auctionStatus: "Finished",
      tradingStatus: "Winner",
      loadCity: "Пермь",
      loadDate: "2026-05-26T09:00:00Z",
      isAvailable: false,
      isBidder: true,
      currentPrice: 30_000,
      pricePerKm: 15,
    }),
    createListItem({
      id: 3,
      cargoNum: "0003",
      createdAt: "2026-05-22T10:00:00Z",
      tradingStatus: "Losing",
      loadCity: "  КАЗАНЬ ",
      loadDate: "2026-05-27T09:00:00Z",
      currentPrice: 25_000,
    }),
  ]

  it("combines filters and normalizes city comparison", () => {
    const response = createAuctionListResponse(items, {
      status: ["Leading", "Losing"],
      statuses: [2],
      auc_type: ["Down"],
      load_city: " казань ",
      unload_city: "МОСКВА",
      is_available: true,
      is_bidder: false,
      current_price_from: 25_000,
      current_price_to: 25_000,
    })

    expect(response.data?.map((item) => item.main?.id)).toEqual([3])
    expect(response.meta?.total).toBe(1)
  })

  it("includes exact date and price boundaries", () => {
    const response = createAuctionListResponse(items, {
      load_date_from: "2026-05-25T09:00:00Z",
      load_date_to: "2026-05-26T09:00:00Z",
      current_price_from: 20_000,
      current_price_to: 30_000,
      is_bidder: true,
      is_available: true,
    })

    expect(response.data?.map((item) => item.main?.id)).toEqual([1])
  })

  it("sorts by a requested field and keeps missing values last", () => {
    const originalItems = structuredClone(items)
    const response = createAuctionListResponse(items, {
      sort: { price_per_km: "asc" },
    })

    expect(response.data?.map((item) => item.main?.id)).toEqual([2, 1, 3])
    expect(items).toEqual(originalItems)
  })

  it("sorts newest first by default and oldest first when requested", () => {
    const newest = createAuctionListResponse(items, {})
    const oldest = createAuctionListResponse(items, { is_oldest: true })

    expect(newest.data?.map((item) => item.main?.id)).toEqual([3, 2, 1])
    expect(oldest.data?.map((item) => item.main?.id)).toEqual([1, 2, 3])
  })

  it("paginates data and fills meta boundaries", () => {
    const response = createAuctionListResponse(items, {
      page: 2,
      per_page: 2,
      is_oldest: true,
    })

    expect(response.data?.map((item) => item.main?.id)).toEqual([3])
    expect(response.meta).toEqual({
      current_page: 2,
      last_page: 2,
      per_page: 2,
      total: 3,
      from: 3,
      to: 3,
    })
  })

  it("returns stable empty meta for an out-of-range page", () => {
    const response = createAuctionListResponse(items, {
      page: 5,
      per_page: 2,
    })

    expect(response.data).toEqual([])
    expect(response.meta).toEqual({
      current_page: 5,
      last_page: 2,
      per_page: 2,
      total: 3,
    })
  })

  it("returns an empty state when no auction matches", () => {
    const response = createAuctionListResponse(items, {
      cargo_num: "missing",
    })

    expect(response.data).toEqual([])
    expect(response.meta).toEqual({
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    })
  })
})

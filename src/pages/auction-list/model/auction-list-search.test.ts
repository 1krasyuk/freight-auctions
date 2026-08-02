import { describe, expect, it } from "vitest"

import {
  auctionListSearchSchema,
  buildAuctionListRequest,
} from "./auction-list-search"

describe("auctionListSearchSchema", () => {
  it("uses safe pagination defaults", () => {
    expect(auctionListSearchSchema.parse({})).toMatchObject({
      page: 1,
      per_page: 20,
    })

    expect(
      auctionListSearchSchema.parse({
        page: "-1",
        per_page: "invalid",
      })
    ).toMatchObject({
      page: 1,
      per_page: 20,
    })
  })

  it("normalizes URL string values", () => {
    const result = auctionListSearchSchema.parse({
      page: "2",
      per_page: "10",
      cargo_num: "  1059  ",
      is_available: "true",
      is_bidder: "false",
      current_price_from: "0",
      current_price_to: "50000",
    })

    expect(result).toMatchObject({
      page: 2,
      per_page: 10,
      cargo_num: "1059",
      is_available: true,
      is_bidder: false,
      current_price_from: 0,
      current_price_to: 50_000,
    })
  })

  it("normalizes scalar enum values to arrays", () => {
    const result = auctionListSearchSchema.parse({
      status: "Leading",
      statuses: "2",
      auc_type: "Down",
    })

    expect(result.status).toEqual(["Leading"])
    expect(result.statuses).toEqual([2])
    expect(result.auc_type).toEqual(["Down"])
  })

  it("drops invalid optional values instead of throwing", () => {
    const result = auctionListSearchSchema.parse({
      cargo_num: "   ",
      is_available: "yes",
      status: "InvalidStatus",
      statuses: "8",
      auc_type: "UnknownType",
      load_date_from: "not-a-date",
      current_price_from: "not-a-number",
    })

    expect(result).toMatchObject({
      page: 1,
      per_page: 20,
    })
    expect(result.cargo_num).toBeUndefined()
    expect(result.is_available).toBeUndefined()
    expect(result.status).toBeUndefined()
    expect(result.statuses).toBeUndefined()
    expect(result.auc_type).toBeUndefined()
    expect(result.load_date_from).toBeUndefined()
    expect(result.current_price_from).toBeUndefined()
  })

  it("accepts valid ISO 8601 date boundaries", () => {
    const result = auctionListSearchSchema.parse({
      load_date_from: "2026-05-25T00:00:00+03:00",
      load_date_to: "2026-05-31T23:59:59.999Z",
    })

    expect(result.load_date_from).toBe("2026-05-25T00:00:00+03:00")
    expect(result.load_date_to).toBe("2026-05-31T23:59:59.999Z")
  })
})

describe("buildAuctionListRequest", () => {
  it("builds a contract request and omits empty optional fields", () => {
    const search = auctionListSearchSchema.parse({
      page: "2",
      per_page: "10",
      cargo_num: "1059",
      status: ["Leading", "Losing"],
      statuses: [2, "6"],
      auc_type: "Down",
      load_city: "Казань",
      unload_city: "Москва",
      is_available: "true",
      is_bidder: "false",
      current_price_from: "0",
      current_price_to: "50000",
    })

    expect(buildAuctionListRequest(search)).toEqual({
      page: 2,
      per_page: 10,
      cargo_num: "1059",
      status: ["Leading", "Losing"],
      statuses: [2, 6],
      auc_type: ["Down"],
      load_city: "Казань",
      unload_city: "Москва",
      is_available: true,
      is_bidder: false,
      current_price_from: 0,
      current_price_to: 50_000,
    })
  })

  it.each([
    ["newest", { is_oldest: false }],
    ["oldest", { is_oldest: true }],
    ["current-price-asc", { sort: { current_price: "asc" } }],
    ["current-price-desc", { sort: { current_price: "desc" } }],
    ["price-per-km-asc", { sort: { price_per_km: "asc" } }],
    ["price-per-km-desc", { sort: { price_per_km: "desc" } }],
  ] as const)("maps %s sorting to the API request", (sort, expected) => {
    const search = auctionListSearchSchema.parse({ sort })

    expect(buildAuctionListRequest(search)).toEqual({
      page: 1,
      per_page: 20,
      ...expected,
    })
  })
})

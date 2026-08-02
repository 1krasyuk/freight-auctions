import { describe, expect, it } from "vitest"

import { createSetAuctionBetSchema } from "./set-auction-bet-schema"

describe("createSetAuctionBetSchema", () => {
  it.each([{}, { price: 0 }, { price: -500 }, { price: Number.NaN }])(
    "rejects a missing or invalid positive price: %o",
    (values) => {
      const schema = createSetAuctionBetSchema({})

      expect(schema.safeParse(values).success).toBe(false)
    }
  )

  it("rejects non-finite prices", () => {
    const schema = createSetAuctionBetSchema({})

    expect(schema.safeParse({ price: Number.POSITIVE_INFINITY }).success).toBe(
      false
    )
  })

  it("accepts a positive price when DTO limits are absent", () => {
    const schema = createSetAuctionBetSchema({})

    expect(schema.safeParse({ price: 12_345 }).success).toBe(true)
  })

  it("enforces the minimum price inclusively", () => {
    const schema = createSetAuctionBetSchema({ min: 20_000 })

    expect(schema.safeParse({ price: 19_999 }).success).toBe(false)
    expect(schema.safeParse({ price: 20_000 }).success).toBe(true)
  })

  it("enforces the maximum price inclusively", () => {
    const schema = createSetAuctionBetSchema({ max: 30_000 })

    expect(schema.safeParse({ price: 30_000 }).success).toBe(true)
    expect(schema.safeParse({ price: 30_001 }).success).toBe(false)
  })

  it("calculates the step relative to the minimum price", () => {
    const schema = createSetAuctionBetSchema({
      min: 20_000,
      max: 30_000,
      step: 500,
    })

    expect(schema.safeParse({ price: 20_000 }).success).toBe(true)
    expect(schema.safeParse({ price: 20_500 }).success).toBe(true)
    expect(schema.safeParse({ price: 20_250 }).success).toBe(false)
  })

  it("calculates the step from zero when the minimum is absent", () => {
    const schema = createSetAuctionBetSchema({ step: 500 })

    expect(schema.safeParse({ price: 1_500 }).success).toBe(true)
    expect(schema.safeParse({ price: 1_250 }).success).toBe(false)
  })

  it("supports fractional currency steps without precision errors", () => {
    const schema = createSetAuctionBetSchema({
      min: 0.1,
      step: 0.1,
    })

    expect(schema.safeParse({ price: 0.3 }).success).toBe(true)
    expect(schema.safeParse({ price: 0.35 }).success).toBe(false)
  })

  it.each([null, 0, -500])("ignores a non-positive step: %s", (step) => {
    const schema = createSetAuctionBetSchema({ step })

    expect(schema.safeParse({ price: 12_345 }).success).toBe(true)
  })
})

import { describe, expect, it } from "vitest"

import { auctionBetsSearchSchema } from "./auction-bets-search"

describe("auctionBetsSearchSchema", () => {
  it.each([
    [true, true],
    [false, false],
    ["true", true],
    ["false", false],
  ] as const)("parses setBet=%s as %s", (value, expected) => {
    expect(auctionBetsSearchSchema.parse({ setBet: value })).toEqual({
      setBet: expected,
    })
  })

  it.each([undefined, "yes", "1", 1, null])(
    "falls back to a closed dialog for setBet=%s",
    (value) => {
      expect(auctionBetsSearchSchema.parse({ setBet: value })).toEqual({
        setBet: false,
      })
    }
  )
})

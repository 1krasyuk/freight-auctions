import { z } from "zod"

const booleanSearchParam = z
  .preprocess((value) => {
    if (value === "true") return true
    if (value === "false") return false

    return value
  }, z.boolean())
  .catch(false)

export const auctionBetsSearchSchema = z.object({
  setBet: booleanSearchParam,
})

export type AuctionBetsSearch = z.infer<typeof auctionBetsSearchSchema>

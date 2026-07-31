import { z } from "zod"

import type { AuctionListRequest } from "@/entities/auction"

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 20

const TRADING_STATUSES = [
  "NotParticipating",
  "Leading",
  "Losing",
  "OnPending",
  "Confirmed",
  "ChoosingWinner",
  "Winner",
  "Accepted",
  "Unknown",
] as const

const AUCTION_TYPES = ["Request", "Up", "Down", "FixPrice"] as const

const DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$/

function toNumber(value: unknown): unknown {
  if (typeof value !== "string" || value.trim() === "") {
    return value
  }

  return Number(value)
}

function toBoolean(value: unknown): unknown {
  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

function toOptionalText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value
  }

  const normalizedValue = value.trim()

  return normalizedValue === "" ? undefined : normalizedValue
}

function toArray(value: unknown): unknown {
  if (value === undefined) {
    return undefined
  }

  return Array.isArray(value) ? value : [value]
}

const positiveIntegerSearchParam = z.preprocess(
  toNumber,
  z.number().int().min(1)
)

const optionalNumberSearchParam = z
  .preprocess(toNumber, z.number().finite().optional())
  .catch(undefined)

const optionalBooleanSearchParam = z
  .preprocess(toBoolean, z.boolean().optional())
  .catch(undefined)

const optionalTextSearchParam = z
  .preprocess(toOptionalText, z.string().optional())
  .catch(undefined)

const optionalDateTimeSearchParam = z
  .string()
  .regex(DATE_TIME_PATTERN)
  .refine((value) => !Number.isNaN(Date.parse(value)))
  .optional()
  .catch(undefined)

const optionalTradingStatusesSearchParam = z
  .preprocess(toArray, z.array(z.enum(TRADING_STATUSES)).min(1).optional())
  .catch(undefined)

const optionalAuctionStatusesSearchParam = z
  .preprocess(
    toArray,
    z
      .array(z.preprocess(toNumber, z.number().int().min(1).max(7)))
      .min(1)
      .optional()
  )
  .catch(undefined)

const optionalAuctionTypesSearchParam = z
  .preprocess(toArray, z.array(z.enum(AUCTION_TYPES)).min(1).optional())
  .catch(undefined)

export const auctionListSearchSchema = z.object({
  page: positiveIntegerSearchParam.catch(DEFAULT_PAGE),
  per_page: positiveIntegerSearchParam.catch(DEFAULT_PER_PAGE),
  cargo_num: optionalTextSearchParam,
  status: optionalTradingStatusesSearchParam,
  statuses: optionalAuctionStatusesSearchParam,
  auc_type: optionalAuctionTypesSearchParam,
  load_city: optionalTextSearchParam,
  unload_city: optionalTextSearchParam,
  load_date_from: optionalDateTimeSearchParam,
  load_date_to: optionalDateTimeSearchParam,
  is_available: optionalBooleanSearchParam,
  is_bidder: optionalBooleanSearchParam,
  current_price_from: optionalNumberSearchParam,
  current_price_to: optionalNumberSearchParam,
})

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>

export function buildAuctionListRequest(
  search: AuctionListSearch
): AuctionListRequest {
  return {
    page: search.page,
    per_page: search.per_page,
    ...(search.cargo_num === undefined
      ? {}
      : { cargo_num: search.cargo_num }),
    ...(search.status === undefined ? {} : { status: search.status }),
    ...(search.statuses === undefined ? {} : { statuses: search.statuses }),
    ...(search.auc_type === undefined ? {} : { auc_type: search.auc_type }),
    ...(search.load_city === undefined
      ? {}
      : { load_city: search.load_city }),
    ...(search.unload_city === undefined
      ? {}
      : { unload_city: search.unload_city }),
    ...(search.load_date_from === undefined
      ? {}
      : { load_date_from: search.load_date_from }),
    ...(search.load_date_to === undefined
      ? {}
      : { load_date_to: search.load_date_to }),
    ...(search.is_available === undefined
      ? {}
      : { is_available: search.is_available }),
    ...(search.is_bidder === undefined
      ? {}
      : { is_bidder: search.is_bidder }),
    ...(search.current_price_from === undefined
      ? {}
      : { current_price_from: search.current_price_from }),
    ...(search.current_price_to === undefined
      ? {}
      : { current_price_to: search.current_price_to }),
  }
}

import { z } from "zod"

import type {
  AuctionListItem,
  AuctionListMeta,
  AuctionListRequest,
  AuctionListResponseBase,
  ValidationError,
} from "@/shared/api/generated/Api"

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 20

const DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$/

const auctionListRequestSchema = z
  .object({
    page: z.number().int().min(1).optional(),
    per_page: z.number().int().min(1).optional(),
    cargo_num: z.string().optional(),
    status: z
      .array(
        z.enum([
          "NotParticipating",
          "Leading",
          "Losing",
          "OnPending",
          "Confirmed",
          "ChoosingWinner",
          "Winner",
          "Accepted",
          "Unknown",
        ])
      )
      .optional(),
    statuses: z.array(z.number().int().min(1).max(7)).optional(),
    auc_type: z
      .array(z.enum(["Request", "Up", "Down", "FixPrice"]))
      .optional(),
    load_city: z.string().optional(),
    unload_city: z.string().optional(),
    load_date_from: z
      .string()
      .refine(isDateTime)
      .optional(),
    load_date_to: z
      .string()
      .refine(isDateTime)
      .optional(),
    is_available: z.boolean().optional(),
    is_bidder: z.boolean().optional(),
    current_price_from: z.number().finite().nullable().optional(),
    current_price_to: z.number().finite().nullable().optional(),
  })
  .passthrough()

const AUCTION_STATUS_IDS: Readonly<Record<string, number>> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
}

function isDateTime(value: string): boolean {
  return DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
}

function getValidationMessage(field: string): string {
  if (field === "page" || field === "per_page") {
    return "Значение должно быть целым числом не меньше 1."
  }

  if (field === "load_date_from" || field === "load_date_to") {
    return "Значение должно быть датой и временем в формате ISO 8601."
  }

  return "Некорректное значение."
}

export function validateAuctionListRequest(
  requestBody: unknown
): ValidationError[] {
  const result = auctionListRequestSchema.safeParse(requestBody)

  if (result.success) {
    return []
  }

  return result.error.issues.map((issue) => {
    const field = issue.path.map(String).join(".") || "body"

    return {
      field,
      message: getValidationMessage(field),
    }
  })
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("ru-RU")
}

function matchesText(value: string | undefined, expected: string): boolean {
  return value !== undefined && normalizeText(value) === normalizeText(expected)
}

function matchesLoadDate(
  value: string | undefined,
  from: string | undefined,
  to: string | undefined
): boolean {
  if (from === undefined && to === undefined) {
    return true
  }

  if (value === undefined) {
    return false
  }

  const timestamp = Date.parse(value)
  const fromTimestamp = from === undefined ? undefined : Date.parse(from)
  const toTimestamp = to === undefined ? undefined : Date.parse(to)

  return (
    !Number.isNaN(timestamp) &&
    (fromTimestamp === undefined || timestamp >= fromTimestamp) &&
    (toTimestamp === undefined || timestamp <= toTimestamp)
  )
}

function matchesPrice(
  value: number | undefined,
  from: number | null | undefined,
  to: number | null | undefined
): boolean {
  if (from == null && to == null) {
    return true
  }

  return (
    value !== undefined &&
    (from == null || value >= from) &&
    (to == null || value <= to)
  )
}

function matchesAuction(
  item: AuctionListItem,
  filters: AuctionListRequest
): boolean {
  if (
    filters.cargo_num !== undefined &&
    item.main?.cargo_num !== filters.cargo_num
  ) {
    return false
  }

  if (
    filters.status?.length &&
    (!item.trading?.status_mobile ||
      !filters.status.includes(item.trading.status_mobile))
  ) {
    return false
  }

  if (filters.statuses?.length) {
    const statusId = item.trading?.status
      ? AUCTION_STATUS_IDS[item.trading.status]
      : undefined

    if (statusId === undefined || !filters.statuses.includes(statusId)) {
      return false
    }
  }

  if (
    filters.auc_type?.length &&
    !filters.auc_type.some((auctionType) => auctionType === item.main?.auc_type)
  ) {
    return false
  }

  if (
    filters.load_city !== undefined &&
    !matchesText(item.route?.load?.city, filters.load_city)
  ) {
    return false
  }

  if (
    filters.unload_city !== undefined &&
    !matchesText(item.route?.unload?.city, filters.unload_city)
  ) {
    return false
  }

  if (
    !matchesLoadDate(
      item.route?.load?.date,
      filters.load_date_from,
      filters.load_date_to
    )
  ) {
    return false
  }

  if (
    filters.is_available !== undefined &&
    item.trading?.is_available !== filters.is_available
  ) {
    return false
  }

  if (
    filters.is_bidder !== undefined &&
    item.trading?.is_bidder !== filters.is_bidder
  ) {
    return false
  }

  return matchesPrice(
    item.trading?.price?.current,
    filters.current_price_from,
    filters.current_price_to
  )
}

export function createAuctionListResponse(
  items: AuctionListItem[],
  requestBody: AuctionListRequest
): AuctionListResponseBase {
  const page = requestBody.page ?? DEFAULT_PAGE
  const perPage = requestBody.per_page ?? DEFAULT_PER_PAGE
  const filteredItems = items.filter((item) => matchesAuction(item, requestBody))
  const total = filteredItems.length
  const startIndex = (page - 1) * perPage
  const pageItems = filteredItems.slice(startIndex, startIndex + perPage)

  const meta: AuctionListMeta = {
    current_page: page,
    last_page: Math.max(1, Math.ceil(total / perPage)),
    per_page: perPage,
    total,
  }

  if (pageItems.length > 0) {
    meta.from = startIndex + 1
    meta.to = startIndex + pageItems.length
  }

  return {
    data: pageItems,
    meta,
  }
}

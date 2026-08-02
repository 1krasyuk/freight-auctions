import {
  TradingStatus,
  type BetItem,
  type SetBetRequest,
} from "@/shared/api/generated/Api"
import type { MockAuctionRecord } from "./types"

type SetAuctionBetResult =
  { success: true } | { success: false; message: string }

function isValidStep(price: number, min: number | null, step: number): boolean {
  const stepCount = (price - (min ?? 0)) / step

  return Math.abs(stepCount - Math.round(stepCount)) < 1e-6
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function setAuctionBet(
  record: MockAuctionRecord,
  { price }: SetBetRequest
): SetAuctionBetResult {
  if (!Number.isFinite(price) || price <= 0) {
    return { success: false, message: "Цена должна быть числом больше 0." }
  }

  const priceLimits = record.detail.trading.price
  const min = priceLimits?.min ?? null
  const max = priceLimits?.max ?? null
  const step = priceLimits?.step ?? null

  if (min !== null && price < min) {
    return {
      success: false,
      message: `Цена должна быть не меньше ${min}.`,
    }
  }

  if (max !== null && price > max) {
    return {
      success: false,
      message: `Цена должна быть не больше ${max}.`,
    }
  }

  if (step !== null && step > 0 && !isValidStep(price, min, step)) {
    return {
      success: false,
      message: `Цена должна соответствовать шагу ${step}.`,
    }
  }

  const currentOrganization =
    record.detail.admitted_organizations.find(
      (organization) => organization.is_main === true
    ) ?? record.detail.admitted_organizations[0]
  const paymentForm = record.detail.payment.form?.toLocaleLowerCase("ru-RU")
  const vatRate = Number(currentOrganization?.current_vat_rate)
  const priceWithoutVat = paymentForm?.includes("без ндс")
    ? price
    : Number.isFinite(vatRate) && vatRate > 0
      ? roundCurrency(price / (1 + vatRate / 100))
      : price
  const currentBet = record.bets.find(
    (bet) =>
      !bet.cancel_reason &&
      ((currentOrganization?.id !== undefined &&
        bet.organization_id === currentOrganization.id) ||
        (currentOrganization?.subscriber_id !== undefined &&
          bet.subscriber_id === currentOrganization.subscriber_id))
  )

  if (currentBet?.place !== 1) {
    for (const bet of record.bets) {
      if (bet !== currentBet && !bet.cancel_reason && bet.place != null) {
        bet.place += 1
      }
    }
  }

  const betData = {
    id:
      currentBet?.id ??
      Math.max(0, ...record.bets.map((bet) => bet.id ?? 0)) + 1,
    created_at: new Date().toISOString(),
    auction_id: record.detail.main.id,
    subscriber_id: currentOrganization?.subscriber_id,
    price_with_vat: price,
    price_no_vat: priceWithoutVat,
    organization_id: currentOrganization?.id,
    organization_inn: currentOrganization?.inn,
    organization_name: currentOrganization?.name,
    transporter_comment: currentBet?.transporter_comment ?? null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: currentBet?.run_number ?? 0,
    cancel_reason: "",
    price_info: {
      price_with_vat: price,
      price_no_vat: priceWithoutVat,
      payment_type: record.detail.payment.form ?? null,
      vat_rate: currentOrganization?.current_vat_rate ?? null,
    },
  } satisfies BetItem

  if (currentBet) {
    Object.assign(currentBet, betData)
  } else {
    record.bets.push(betData)
  }

  record.detail.trading.price = {
    ...record.detail.trading.price,
    current: price,
    current_no_vat: priceWithoutVat,
  }
  record.detail.trading.your = {
    ...record.detail.trading.your,
    bet: true,
    last_bet: price,
    last_bet_with_vat: price,
    win: false,
  }
  record.detail.trading.status_mobile = TradingStatus.Leading
  record.detail.trading.is_bidder = true

  if (record.listItem.trading) {
    record.listItem.trading.price = {
      ...record.listItem.trading.price,
      current: price,
      current_no_vat: priceWithoutVat,
    }
    record.listItem.trading.your = {
      ...record.listItem.trading.your,
      bet: true,
      last_bet: price,
    }
    record.listItem.trading.status_mobile = "Leading"
    record.listItem.trading.is_bidder = true
  }

  return { success: true }
}

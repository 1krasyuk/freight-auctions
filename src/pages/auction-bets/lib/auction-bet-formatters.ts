import type { AuctionBet } from "@/entities/auction"

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

export type FormattedBetDate = {
  date: string
  time: string
}

export function formatPrice(value: number | null | undefined): string {
  return value == null ? "Не указана" : priceFormatter.format(value)
}

export function formatBetDate(
  value: string | undefined
): FormattedBetDate | undefined {
  if (!value) return undefined

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? undefined
    : {
        date: dateFormatter.format(date).replace(/\s*г\.$/u, ""),
        time: timeFormatter.format(date),
      }
}

export function getPriceWithVat(bet: AuctionBet): number | null | undefined {
  return bet.price_with_vat ?? bet.price_info?.price_with_vat
}

export function getPriceWithoutVat(bet: AuctionBet): number | null | undefined {
  return bet.price_no_vat ?? bet.price_info?.price_no_vat
}

export function getParticipantCount(bets: AuctionBet[]): number {
  return new Set(
    bets
      .map((bet) =>
        bet.organization_id !== undefined
          ? `organization:${bet.organization_id}`
          : bet.subscriber_id !== undefined
            ? `subscriber:${bet.subscriber_id}`
            : undefined
      )
      .filter((participantKey): participantKey is string =>
        Boolean(participantKey)
      )
  ).size
}

export function hasAuctionBetDetails(bet: AuctionBet): boolean {
  return Boolean(bet.transporter_comment?.trim() || bet.cancel_reason?.trim())
}

export function getAuctionBetKey(bet: AuctionBet, index: number): string {
  return String(bet.id ?? `${bet.organization_id ?? "unknown"}-${index}`)
}

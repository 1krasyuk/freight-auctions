import type { ReactNode } from "react"
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  Clock3Icon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react"

import type { AuctionListItem } from "../api/queries/auction-list-query"
import { Badge } from "@/shared/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"

const auctionTypeLabels: Record<
  NonNullable<AuctionListItem["main"]>["auc_type"] & string,
  string
> = {
  Request: "Запрос ставок",
  Up: "На повышение",
  Down: "На понижение",
  FixPrice: "Фиксированная цена",
  Unknown: "Неизвестный тип",
}

const auctionStatusLabels: Record<string, string> = {
  Planning: "Планируется",
  Auction: "Идут торги",
  DeterminateWinner: "Выбор победителя",
  WaitDeal: "Ожидает сделки",
  InProgress: "В работе",
  Finished: "Завершён",
  Stopped: "Остановлен",
  Canceled: "Отменён",
  Unknown: "Неизвестный статус",
}

const tradingStatusLabels: Record<string, string> = {
  NotParticipating: "Не участвуете",
  Leading: "Вы лидируете",
  Losing: "Ставка перебита",
  Winner: "Вы победили",
  Confirmed: "Подтверждено",
  Unknown: "Статус неизвестен",
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

const tradingDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

const tradingTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
})

function formatDate(value: string | undefined): string {
  if (!value) {
    return "Дата не указана"
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? "Дата не указана"
    : dateFormatter.format(date)
}

function formatNumber(value: number | undefined, suffix: string): string {
  return value === undefined
    ? "—"
    : `${value.toLocaleString("ru-RU")} ${suffix}`
}

function formatTradingDate(value: string | undefined): string {
  if (!value) {
    return "Дата не указана"
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? "Дата не указана"
    : `${tradingDateFormatter.format(date).replace(/\s*г\.$/u, "")}, ${tradingTimeFormatter.format(date)}`
}

function getVatLabel(paymentForm: string | undefined): string | undefined {
  if (!paymentForm) {
    return undefined
  }

  const normalizedForm = paymentForm.toLocaleLowerCase("ru-RU")

  if (normalizedForm.includes("без ндс")) {
    return "Без НДС"
  }

  return normalizedForm.includes("с ндс") ? "С НДС" : undefined
}

function isEndingSoon(value: string | undefined, currentTime: number): boolean {
  if (!value) {
    return false
  }

  const endTime = new Date(value).getTime()
  const timeRemaining = endTime - currentTime

  return timeRemaining > 0 && timeRemaining <= 12 * 60 * 60 * 1000
}

function getTradingBadgeVariant(
  status: string | undefined,
  isBidder: boolean | undefined
): "default" | "success" | "secondary" | "destructive" | "outline" {
  if (status === "Winner") {
    return "success"
  }

  if (status === "Losing") {
    return "destructive"
  }

  if (status === "Leading" || isBidder) {
    return "default"
  }

  return status === "NotParticipating" ? "outline" : "secondary"
}

function formatOrganizationName(
  name: string | undefined,
  isHidden: boolean | undefined
): string {
  if (isHidden) {
    return "Организатор скрыт"
  }

  if (!name?.trim()) {
    return "Организатор не указан"
  }

  const trimmedName = name.trim()
  const limitedCompanyMatch = /^ООО\s+(.+)$/iu.exec(trimmedName)

  if (!limitedCompanyMatch) {
    return trimmedName
  }

  const companyName = limitedCompanyMatch[1].replace(/^[«"“”]+|[»"“”]+$/gu, "")

  return `ООО «${companyName}»`
}

type AuctionCardProps = {
  auction: AuctionListItem
  currentTime: number
  action?: ReactNode
}

export function AuctionCard({
  auction,
  currentTime,
  action,
}: AuctionCardProps) {
  const auctionType = auction.main?.auc_type
  const auctionStatus = auction.trading?.status
  const tradingStatus = auction.trading?.status_mobile
  const currentPrice = auction.trading?.price?.current
  const startPrice = auction.trading?.price?.start
  const pricePerKm = auction.main?.price_per_km
  const lastBet = auction.trading?.your?.last_bet
  const vatLabel = getVatLabel(auction.payment?.form)
  const isUrgent = isEndingSoon(auction.trading?.stop_time, currentTime)

  return (
    <Card className="h-full w-full max-w-full min-w-0 pb-0 text-sm/relaxed shadow-sm transition-shadow [--card-spacing:--spacing(3)] hover:shadow-md sm:[--card-spacing:--spacing(5)]">
      <CardHeader className="min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <CardTitle className="text-lg font-bold tracking-tight sm:text-2xl">
              Заявка № {auction.main?.cargo_num ?? "—"}
            </CardTitle>
            <Badge
              variant={getTradingBadgeVariant(
                tradingStatus,
                auction.trading?.is_bidder
              )}
              className="h-6 px-2 text-xs font-semibold sm:h-7 sm:px-3 sm:text-xs"
            >
              {tradingStatus
                ? tradingStatusLabels[tradingStatus]
                : auction.trading?.is_bidder
                  ? "Участвуете"
                  : "Не участвуете"}
            </Badge>
          </div>
          <div className="mt-3 sm:mt-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Организатор
            </p>
            <p className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
              {formatOrganizationName(
                auction.organizer?.organization_name,
                auction.organizer?.is_hide_organization
              )}
            </p>
          </div>
        </div>
        <dl className="grid min-w-0 grid-cols-2 items-stretch divide-x rounded-lg bg-muted/40 p-2.5 sm:block sm:min-w-50 sm:space-y-4 sm:divide-x-0 sm:bg-transparent sm:p-0 sm:pl-4">
          <div className="min-w-0 pr-2 sm:pr-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <span className="sm:hidden">Начало торгов</span>
              <span className="hidden sm:inline">Дата начала торгов</span>
            </p>
            <p className="mt-1 text-xs leading-tight font-medium sm:text-base sm:font-semibold sm:whitespace-nowrap">
              {formatTradingDate(auction.trading?.start_time)}
            </p>
          </div>
          <div className="min-w-0 pl-2 sm:pl-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <span className="sm:hidden">Окончание торгов</span>
              <span className="hidden sm:inline">Дата окончания торгов</span>
            </p>
            <p
              className={
                isUrgent
                  ? "mt-1 inline-flex items-center gap-1 text-xs leading-tight font-medium text-destructive sm:gap-1.5 sm:text-base sm:font-semibold sm:whitespace-nowrap"
                  : "mt-1 text-xs leading-tight font-medium sm:text-base sm:font-semibold sm:whitespace-nowrap"
              }
            >
              {isUrgent ? <Clock3Icon className="size-4" /> : null}
              {formatTradingDate(auction.trading?.stop_time)}
            </p>
          </div>
        </dl>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>

      <Separator />

      <CardContent className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-2.5 self-center">
          <div className="flex items-start gap-2">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
            <div className="min-w-0 space-y-1">
              <div className="flex min-w-0 items-center gap-2 text-base font-semibold">
                <span className="truncate">
                  {auction.route?.load?.city ?? "Пункт погрузки не указан"}
                </span>
                <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {auction.route?.unload?.city ?? "Пункт выгрузки не указан"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDaysIcon className="size-3.5" />
                  {formatDate(auction.route?.load?.date)}
                </span>
                <ArrowRightIcon className="size-3.5 shrink-0" />
                <span>{formatDate(auction.route?.unload?.date)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:block sm:space-y-2.5">
            <div className="flex items-start gap-2 sm:gap-3">
              <PackageIcon className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
              <div>
                <p className="font-semibold sm:text-base">
                  {auction.cargo?.name ?? "Груз не указан"}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {formatNumber(auction.cargo?.weight, "т")} ·{" "}
                  {formatNumber(auction.cargo?.volume, "м³")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <TruckIcon className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
              <div>
                <p className="font-semibold sm:text-base">
                  {auction.cargo?.body_type ?? "Тип кузова не указан"}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Машин: {auction.cargo?.truck_count ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-3 sm:grid sm:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,0.8fr)] sm:items-stretch sm:gap-2 sm:p-4">
          <div className="min-w-0 self-center text-center sm:text-left">
            <p className="text-sm font-medium text-muted-foreground">
              Текущая цена
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:block">
              <p
                className={
                  currentPrice === undefined
                    ? "text-3xl font-bold tracking-tight text-primary sm:text-[clamp(1.25rem,calc(4vw-1rem),2.25rem)]"
                    : "text-3xl font-bold tracking-tight whitespace-nowrap text-primary sm:text-[clamp(1.375rem,calc(6vw-2rem),3rem)]"
                }
              >
                {currentPrice === undefined
                  ? "Не указана"
                  : priceFormatter.format(currentPrice)}
              </p>
              {vatLabel ? (
                <Badge
                  variant="outline"
                  className="h-5 px-2 text-xs font-semibold sm:mt-2"
                >
                  {vatLabel}
                </Badge>
              ) : null}
            </div>
          </div>
          <Separator orientation="vertical" className="my-1 hidden sm:block" />
          <dl className="mt-3 grid w-full min-w-0 grid-cols-3 divide-x text-center text-[0.6875rem] sm:mt-0 sm:block sm:divide-x-0 sm:divide-y sm:text-sm">
            <div className="px-1 sm:px-0 sm:pb-2">
              <dt className="text-muted-foreground">Стартовая</dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {startPrice === undefined
                  ? "—"
                  : priceFormatter.format(startPrice)}
              </dd>
            </div>
            <div className="px-1 sm:px-0 sm:py-2">
              <dt className="text-muted-foreground">За километр</dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {pricePerKm == null
                  ? "—"
                  : `${pricePerKm.toLocaleString("ru-RU")} ₽`}
              </dd>
            </div>
            <div className="px-1 sm:px-0 sm:pt-2">
              <dt className="text-muted-foreground">Моя ставка</dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {lastBet == null ? "Нет" : priceFormatter.format(lastBet)}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>

      <CardFooter className="-mt-1 flex-nowrap items-center gap-1 border-t !px-3 !py-2 text-muted-foreground sm:-mt-3 sm:justify-between sm:!px-5 xl:gap-3 xl:text-sm">
        <div className="flex min-w-0 flex-nowrap items-center gap-1 self-center xl:gap-2">
          <Badge
            variant="outline"
            className="h-6 px-2 text-[0.6875rem] font-semibold xl:h-7 xl:px-3 xl:text-xs"
          >
            {auctionType ? auctionTypeLabels[auctionType] : "Тип не указан"}
          </Badge>
          <Badge
            variant="secondary"
            className="h-6 px-2 text-[0.6875rem] font-semibold xl:h-7 xl:px-3 xl:text-xs"
          >
            {auctionStatus
              ? auctionStatusLabels[auctionStatus]
              : "Статус не указан"}
          </Badge>
        </div>
        <span className="ml-auto shrink-0 text-[0.625rem] whitespace-nowrap sm:text-xs xl:text-sm">
          {auction.trading?.is_available
            ? "Ставка доступна"
            : "Ставка недоступна"}
        </span>
      </CardFooter>
    </Card>
  )
}

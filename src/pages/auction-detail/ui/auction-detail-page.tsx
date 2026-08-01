import {
  ArrowLeftIcon,
  AlertCircleIcon,
  EyeOffIcon,
  MoonIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SunIcon,
} from "lucide-react"
import {
  Link,
  useParams,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { isAxiosError } from "axios"

import { useTheme } from "@/app/providers/theme-provider"
import { useAuctionDetail } from "@/entities/auction"
import { AuctionCargoCard } from "./auction-cargo-card"
import { AuctionDetailSkeleton } from "./auction-detail-skeleton"
import { AuctionRouteCard } from "./auction-route-card"
import { AuctionTermsCard } from "./auction-terms-card"
import { AuctionTradingCard } from "./auction-trading-card"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"

type ProblemDetailLike = {
  code: string
  title: string
  message: string
  trace_id?: string | null
}

function isProblemDetail(value: unknown): value is ProblemDetailLike {
  if (typeof value !== "object" || value === null) return false

  return (
    "code" in value &&
    typeof value.code === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "message" in value &&
    typeof value.message === "string"
  )
}

function getAuctionErrorContent(error: unknown): ProblemDetailLike {
  if (isAxiosError(error)) {
    if (isProblemDetail(error.response?.data)) {
      return error.response.data
    }

    switch (error.response?.status) {
      case 401:
        return {
          code: "unauthorized",
          title: "Требуется авторизация",
          message: "Авторизуйтесь и повторите запрос.",
        }
      case 404:
        return {
          code: "resource_not_found",
          title: "Аукцион не найден",
          message: "Возможно, он был удалён или ссылка устарела.",
        }
      case 503:
        return {
          code: "service_unavailable",
          title: "Сервис временно недоступен",
          message: "Повторите запрос через некоторое время.",
        }
    }
  }

  return {
    code: "network_error",
    title: "Не удалось связаться с сервисом",
    message:
      "Повторите запрос. Если это не поможет, обновите страницу целиком.",
  }
}

const auctionTypeLabels: Record<string, string> = {
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
  Unknown: "Статус неизвестен",
}

const tradingStatusLabels: Record<string, string> = {
  NotParticipating: "Не участвуете",
  Leading: "Вы лидируете",
  Losing: "Ставка перебита",
  OnPending: "На рассмотрении",
  Confirmed: "Подтверждено",
  ChoosingWinner: "Выбор победителя",
  Winner: "Вы победили",
  Accepted: "Принято",
  Unknown: "Статус неизвестен",
}

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" })
  const { theme, setTheme } = useTheme()
  const auctionQuery = useAuctionDetail(auctionUuid)
  const auction = auctionQuery.data

  if (!auction) {
    return <AuctionDetailPending />
  }

  const hidePrivateData =
    auction.trading.hide_points_address_and_contacts === true
  const auctionStatus = auction.trading.status ?? "Unknown"
  const tradingStatus = auction.trading.status_mobile ?? "Unknown"

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          className="-ml-2 h-9 px-3 text-sm"
          render={<Link to="/" />}
        >
          <ArrowLeftIcon />К списку аукционов
        </Button>
        <Label className="flex shrink-0 items-center gap-2 rounded-full border bg-background/70 px-2 py-2 shadow-sm backdrop-blur-sm sm:px-3">
          <SunIcon className="size-4 dark:text-muted-foreground" />
          <Switch
            aria-label="Тёмная тема"
            checked={
              theme === "dark" ||
              (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            }
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <MoonIcon className="size-4 text-muted-foreground dark:text-foreground" />
        </Label>
      </div>

      <header className="rounded-2xl border bg-linear-to-br from-card via-card to-primary/8 p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-wider text-primary uppercase">
              Грузовой аукцион
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Заявка № {auction.main.cargo_num ?? "—"}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
              Организатор
            </p>
            <p className="mt-0.5 text-lg font-bold sm:text-xl">
              {auction.organizer.organization_name ?? "Не указан"}
            </p>
          </div>
          <div className="flex max-w-md flex-wrap gap-2 sm:justify-end">
            <Badge variant="outline" className="h-7 px-3 text-xs">
              {auctionTypeLabels[auction.main.auc_type ?? "Unknown"]}
            </Badge>
            <Badge variant="secondary" className="h-7 px-3 text-xs">
              {auctionStatusLabels[auctionStatus]}
            </Badge>
            <Badge
              variant={tradingStatus === "Winner" ? "success" : "default"}
              className="h-7 px-3 text-xs"
            >
              {tradingStatusLabels[tradingStatus]}
            </Badge>
          </div>
        </div>
      </header>

      {auction.hide_bets_history || auction.trading.hide_bets_history ? (
        <Alert className="block p-5 text-center sm:p-6">
          <div className="flex items-center justify-center gap-2">
            <EyeOffIcon className="size-5" />
            <AlertTitle className="text-base font-semibold">
              История ставок скрыта
            </AlertTitle>
          </div>
          <AlertDescription className="mt-1 text-sm">
            Организатор запретил просмотр истории ставок этого аукциона.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="order-2 space-y-5 lg:order-1">
          <AuctionRouteCard
            routes={auction.routes}
            hidePrivateData={hidePrivateData}
          />
          <AuctionCargoCard cargo={auction.cargo} routes={auction.routes} />
          <AuctionTermsCard
            organizer={auction.organizer}
            contacts={auction.contacts}
            payment={auction.payment}
            hideContacts={hidePrivateData}
          />
        </div>
        <aside className="order-1 lg:sticky lg:top-5 lg:order-2">
          <AuctionTradingCard
            trading={auction.trading}
            currencyCode={auction.payment.currency_code}
          />
        </aside>
      </div>
    </main>
  )
}

export function AuctionDetailPending() {
  return <AuctionDetailSkeleton />
}

export function AuctionDetailError({ error, reset }: ErrorComponentProps) {
  const errorContent = getAuctionErrorContent(error)

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <Card
        role="alert"
        className="aspect-square w-full max-w-md items-center justify-center rounded-2xl text-center shadow-sm [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]"
      >
        <CardContent className="flex flex-col items-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircleIcon className="size-8" />
          </div>
          <p className="mt-6 text-sm font-bold tracking-wider text-destructive uppercase">
            Ошибка загрузки
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {errorContent.title}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {errorContent.message}
          </p>
          {errorContent.trace_id ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Код обращения: {errorContent.trace_id}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={reset}>
              <RotateCcwIcon />
              Повторить запрос
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCwIcon />
              Обновить страницу
            </Button>
            <Button variant="ghost" render={<Link to="/" />}>
              <ArrowLeftIcon />К списку
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

import {
  AlertCircleIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  RotateCcwIcon,
} from "lucide-react"
import {
  Link,
  useParams,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { isAxiosError } from "axios"

import { useAuctionDetail } from "@/entities/auction"
import { AuctionCargoCard } from "./auction-cargo-card"
import { AuctionDetailSkeleton } from "./auction-detail-skeleton"
import { AuctionRouteCard } from "./auction-route-card"
import { AuctionTermsCard } from "./auction-terms-card"
import { AuctionTradingCard } from "./auction-trading-card"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

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

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" })
  const auctionQuery = useAuctionDetail(auctionUuid)
  const auction = auctionQuery.data

  if (!auction) {
    return <AuctionDetailPending />
  }

  const hidePrivateData =
    auction.trading.hide_points_address_and_contacts === true
  return (
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

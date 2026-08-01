import { ArrowLeftIcon, AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import {
  Link,
  useParams,
  type ErrorComponentProps,
} from "@tanstack/react-router"

import { useAuctionDetail } from "@/entities/auction"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

function formatNumber(value: number | null | undefined): string {
  return value == null ? "Не указана" : value.toLocaleString("ru-RU")
}

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" })
  const auctionQuery = useAuctionDetail(auctionUuid)
  const auction = auctionQuery.data

  if (!auction) {
    return <AuctionDetailPending />
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button variant="ghost" render={<Link to="/" />}>
        <ArrowLeftIcon />К списку аукционов
      </Button>

      <header className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Грузовой аукцион
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Заявка № {auction.main.cargo_num ?? "—"}
        </h1>
        <p className="text-muted-foreground">
          {auction.organizer.organization_name ?? "Организатор не указан"}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Основные данные</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm text-muted-foreground">UUID</dt>
              <dd className="mt-1 font-medium break-all">
                {auction.main.order_uid ?? auctionUuid}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Статус</dt>
              <dd className="mt-1 font-medium">
                {auction.trading.status ?? "Не указан"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Текущая цена</dt>
              <dd className="mt-1 font-medium">
                {formatNumber(auction.trading.price?.current)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Шаг ставки</dt>
              <dd className="mt-1 font-medium">
                {formatNumber(auction.trading.price?.step)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  )
}

export function AuctionDetailPending() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Skeleton className="h-9 w-44" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
    </main>
  )
}

export function AuctionDetailError({ reset }: ErrorComponentProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8 sm:px-6">
      <Alert variant="destructive" className="p-5">
        <AlertCircleIcon />
        <AlertTitle>Не удалось загрузить аукцион</AlertTitle>
        <AlertDescription className="flex flex-wrap gap-3">
          <span>Аукцион не найден или временно недоступен.</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={reset}>
              <RefreshCwIcon />
              Повторить
            </Button>
            <Button variant="ghost" render={<Link to="/" />}>
              К списку
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </main>
  )
}

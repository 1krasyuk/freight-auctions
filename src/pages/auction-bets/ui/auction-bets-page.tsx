import {
  AlertCircleIcon,
  EyeOffIcon,
  RefreshCwIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react"
import { useParams, type ErrorComponentProps } from "@tanstack/react-router"
import { isAxiosError } from "axios"

import {
  useAuctionBets,
  useAuctionDetail,
  type AuctionBet,
} from "@/entities/auction"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
})

type ProblemDetailLike = {
  title: string
  message: string
}

function isProblemDetail(value: unknown): value is ProblemDetailLike {
  if (typeof value !== "object" || value === null) return false

  return (
    "title" in value &&
    typeof value.title === "string" &&
    "message" in value &&
    typeof value.message === "string"
  )
}

function formatPrice(value: number | null | undefined): string {
  return value == null ? "Не указана" : priceFormatter.format(value)
}

function getPriceWithVat(bet: AuctionBet): number | null | undefined {
  return bet.price_with_vat ?? bet.price_info?.price_with_vat
}

function getPriceWithoutVat(bet: AuctionBet): number | null | undefined {
  return bet.price_no_vat ?? bet.price_info?.price_no_vat
}

function getParticipantCount(bets: AuctionBet[]): number {
  return new Set(
    bets
      .map((bet) => bet.organization_id)
      .filter((organizationId): organizationId is number =>
        Number.isFinite(organizationId)
      )
  ).size
}

type AuctionBetCardProps = {
  bet: AuctionBet
  hidePlace: boolean
}

function AuctionBetCard({ bet, hidePlace }: AuctionBetCardProps) {
  const cancelReason = bet.cancel_reason?.trim()

  return (
    <Card className="shadow-sm [--card-spacing:--spacing(5)]">
      <CardHeader className="gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <CardTitle className="text-lg font-bold sm:text-xl">
            {bet.organization_name?.trim() || "Перевозчик не указан"}
          </CardTitle>
          {bet.organization_inn ? (
            <CardDescription className="mt-1 text-sm">
              ИНН {bet.organization_inn}
            </CardDescription>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 sm:max-w-sm sm:justify-end">
          {bet.is_win ? (
            <Badge variant="success" className="h-7 px-3 text-xs">
              <TrophyIcon />Победитель
            </Badge>
          ) : null}
          {cancelReason ? (
            <Badge variant="destructive" className="h-7 px-3 text-xs">
              Отменена
            </Badge>
          ) : null}
          {bet.is_rejected ? (
            <Badge variant="destructive" className="h-7 px-3 text-xs">
              Отклонена
            </Badge>
          ) : null}
          {bet.is_counter ? (
            <Badge variant="secondary" className="h-7 px-3 text-xs">
              Встречная
            </Badge>
          ) : null}
          {!hidePlace && bet.place != null ? (
            <Badge variant="outline" className="h-7 px-3 text-xs">
              Место: {bet.place}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <dl className="grid gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Цена с НДС</dt>
            <dd className="mt-1 text-xl font-bold text-primary sm:text-2xl">
              {formatPrice(getPriceWithVat(bet))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Цена без НДС</dt>
            <dd className="mt-1 text-lg font-semibold sm:text-xl">
              {formatPrice(getPriceWithoutVat(bet))}
            </dd>
          </div>
        </dl>

        {cancelReason ? (
          <Alert variant="destructive" className="mt-4 p-3">
            <AlertCircleIcon />
            <AlertTitle className="text-sm font-semibold">
              Причина отмены
            </AlertTitle>
            <AlertDescription className="text-sm">
              {cancelReason}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function AuctionBetsPage() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid/bets" })
  const auctionQuery = useAuctionDetail(auctionUuid)
  const auction = auctionQuery.data
  const isHistoryHidden = Boolean(
    auction?.hide_bets_history || auction?.trading.hide_bets_history
  )
  const betsQuery = useAuctionBets(auctionUuid, {
    all: true,
    enabled: !isHistoryHidden,
  })

  if (isHistoryHidden) {
    return (
      <Alert className="block p-6 text-center sm:p-8">
        <EyeOffIcon className="mx-auto size-8 text-muted-foreground" />
        <AlertTitle className="mt-3 text-lg font-bold">
          История ставок скрыта
        </AlertTitle>
        <AlertDescription className="mt-1 text-sm">
          Организатор запретил просмотр истории ставок этого аукциона.
        </AlertDescription>
      </Alert>
    )
  }

  const bets = betsQuery.data?.bets ?? []

  if (bets.length === 0) {
    return (
      <Card className="items-center p-8 text-center shadow-sm sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UsersIcon className="size-7" />
        </div>
        <CardTitle className="text-xl font-bold">Ставок пока нет</CardTitle>
        <CardDescription className="max-w-md text-sm">
          Участники ещё не сделали ни одной ставки по этому аукциону.
        </CardDescription>
      </Card>
    )
  }

  const participantCount = getParticipantCount(bets)
  const hidePlace = auction?.trading.hide_places === true

  return (
    <section aria-labelledby="auction-bets-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="auction-bets-title" className="text-2xl font-bold">
            Ставки участников
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Всего ставок: {bets.length}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold shadow-sm">
          <UsersIcon className="size-4 text-primary" />
          Участников: {participantCount}
        </div>
      </div>

      <div className="grid gap-4">
        {bets.map((bet, index) => (
          <AuctionBetCard
            key={bet.id ?? `${bet.organization_id ?? "unknown"}-${index}`}
            bet={bet}
            hidePlace={hidePlace}
          />
        ))}
      </div>
    </section>
  )
}

export function AuctionBetsPending() {
  return (
    <div className="space-y-4" aria-label="Загрузка ставок">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-44 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function AuctionBetsError({ error, reset }: ErrorComponentProps) {
  const problem = isAxiosError(error) && isProblemDetail(error.response?.data)
    ? error.response.data
    : undefined

  return (
    <Alert variant="destructive" className="items-center p-5 sm:grid-cols-[auto_1fr_auto]">
      <AlertCircleIcon className="size-5" />
      <div>
        <AlertTitle className="text-base font-bold">
          {problem?.title ?? "Не удалось загрузить ставки"}
        </AlertTitle>
        <AlertDescription className="mt-1 text-sm">
          {problem?.message ??
            "Повторите запрос. Если ошибка сохранится, обновите страницу."}
        </AlertDescription>
      </div>
      <Button type="button" variant="outline" onClick={reset}>
        <RefreshCwIcon />Повторить
      </Button>
    </Alert>
  )
}

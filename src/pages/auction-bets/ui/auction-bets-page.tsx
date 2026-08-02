import {
  AlertCircleIcon,
  EyeOffIcon,
  RefreshCwIcon,
  UsersIcon,
} from "lucide-react"
import { useParams, type ErrorComponentProps } from "@tanstack/react-router"
import { isAxiosError } from "axios"

import { useAuctionBets, useAuctionDetail } from "@/entities/auction"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Card, CardDescription, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  getAuctionBetKey,
  getParticipantCount,
} from "../lib/auction-bet-formatters"
import { AuctionBetCard } from "./auction-bet-card"
import { AuctionBetsTable } from "./auction-bets-table"

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
      <div>
        <h2 id="auction-bets-title" className="text-2xl font-bold">
          Ставки участников
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ставок: {bets.length} · Участников: {participantCount} · включая
          отменённые
        </p>
      </div>

      <div className="hidden lg:block">
        <AuctionBetsTable bets={bets} hidePlace={hidePlace} />
      </div>

      <div className="grid gap-3 lg:hidden">
        {bets.map((bet, index) => (
          <AuctionBetCard
            key={getAuctionBetKey(bet, index)}
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
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  )
}

export function AuctionBetsError({ error, reset }: ErrorComponentProps) {
  const problem =
    isAxiosError(error) && isProblemDetail(error.response?.data)
      ? error.response.data
      : undefined

  return (
    <Alert
      variant="destructive"
      className="items-center p-5 sm:grid-cols-[auto_1fr_auto]"
    >
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
        <RefreshCwIcon />
        Повторить
      </Button>
    </Alert>
  )
}

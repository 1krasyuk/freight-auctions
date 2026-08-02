import type { AuctionDetail } from "@/entities/auction"
import { Badge } from "@/shared/ui/badge"

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

type AuctionDetailHeaderProps = {
  auction: AuctionDetail
}

export function AuctionDetailHeader({ auction }: AuctionDetailHeaderProps) {
  const auctionStatus = auction.trading.status ?? "Unknown"
  const tradingStatus = auction.trading.status_mobile ?? "Unknown"

  return (
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
  )
}

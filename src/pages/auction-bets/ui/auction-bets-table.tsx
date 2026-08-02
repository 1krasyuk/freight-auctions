import { Clock3Icon } from "lucide-react"

import type { AuctionBet } from "@/entities/auction"
import { Card } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  formatBetDate,
  formatPrice,
  getAuctionBetKey,
  getPriceWithoutVat,
  getPriceWithVat,
  hasAuctionBetDetails,
} from "../lib/auction-bet-formatters"
import {
  AuctionBetDetailsPopover,
  AuctionBetStatusBadge,
  getAuctionBetRowTone,
} from "./auction-bet-details"

type AuctionBetsTableProps = {
  bets: AuctionBet[]
  hidePlace: boolean
}

function AuctionBetsTableRow({
  bet,
  hidePlace,
}: {
  bet: AuctionBet
  hidePlace: boolean
}) {
  const createdAt = formatBetDate(bet.created_at)
  const hasDetails = hasAuctionBetDetails(bet)

  return (
    <TableRow className={getAuctionBetRowTone(bet)}>
      {!hidePlace ? (
        <TableCell className="w-20 px-4 py-4 text-center">
          <span className="inline-flex size-9 items-center justify-center rounded-full border bg-muted text-sm font-bold">
            {bet.place ?? "—"}
          </span>
        </TableCell>
      ) : null}
      <TableCell className="overflow-hidden px-4 py-4">
        <p className="truncate text-base font-bold">
          {bet.organization_name?.trim() || "Перевозчик не указан"}
        </p>
        {bet.organization_inn ? (
          <p className="mt-1 text-sm text-muted-foreground">
            ИНН {bet.organization_inn}
          </p>
        ) : null}
      </TableCell>
      <TableCell className="px-4 py-4">
        <p className="text-lg font-bold text-primary">
          {formatPrice(getPriceWithVat(bet))}
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            с НДС
          </span>
        </p>
        <p className="mt-1 text-sm font-semibold">
          {formatPrice(getPriceWithoutVat(bet))}
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            без НДС
          </span>
        </p>
      </TableCell>
      <TableCell className="px-4 py-4">
        {createdAt ? (
          <span className="flex flex-col whitespace-nowrap">
            <span className="text-base font-semibold">{createdAt.date}</span>
            <span className="inline-flex items-center gap-1.5 text-base text-foreground">
              <Clock3Icon className="size-4 shrink-0 text-primary" />
              {createdAt.time}
            </span>
          </span>
        ) : (
          <span className="text-sm">Не указано</span>
        )}
      </TableCell>
      <TableCell className="px-4 py-4 text-center">
        <AuctionBetStatusBadge bet={bet} />
      </TableCell>
      <TableCell className="px-2 py-4 text-center">
        {hasDetails ? (
          <AuctionBetDetailsPopover bet={bet} />
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}

export function AuctionBetsTable({ bets, hidePlace }: AuctionBetsTableProps) {
  return (
    <Card className="gap-0 py-0 shadow-sm">
      <Table className="table-fixed text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            {!hidePlace ? (
              <TableHead className="w-20 px-4 text-center">Место</TableHead>
            ) : null}
            <TableHead className="w-[25%] px-4">Участник</TableHead>
            <TableHead className="w-[21%] px-4">Ставка</TableHead>
            <TableHead className="w-[18%] px-4">Дата и время</TableHead>
            <TableHead className="w-[15%] px-4 text-center">Статус</TableHead>
            <TableHead className="w-28 px-2 text-center">Детали</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet, index) => (
            <AuctionBetsTableRow
              key={getAuctionBetKey(bet, index)}
              bet={bet}
              hidePlace={hidePlace}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

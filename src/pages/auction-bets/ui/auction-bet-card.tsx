import { Clock3Icon } from "lucide-react"

import type { AuctionBet } from "@/entities/auction"
import { Badge } from "@/shared/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  formatBetDate,
  formatPrice,
  getPriceWithoutVat,
  getPriceWithVat,
  hasAuctionBetDetails,
} from "../lib/auction-bet-formatters"
import {
  AuctionBetDetailsPopover,
  AuctionBetStatusBadge,
} from "./auction-bet-details"

type AuctionBetCardProps = {
  bet: AuctionBet
  hidePlace: boolean
}

export function AuctionBetCard({ bet, hidePlace }: AuctionBetCardProps) {
  const createdAt = formatBetDate(bet.created_at)
  const hasDetails = hasAuctionBetDetails(bet)

  return (
    <Card className="shadow-sm [--card-spacing:--spacing(4)]">
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <CardTitle className="text-lg font-bold">
            {bet.organization_name?.trim() || "Перевозчик не указан"}
          </CardTitle>
          {bet.organization_inn ? (
            <CardDescription className="mt-1 text-sm">
              ИНН {bet.organization_inn}
            </CardDescription>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          {!hidePlace ? (
            <Badge variant="outline" className="h-7 px-3 text-xs">
              Место: {bet.place ?? "—"}
            </Badge>
          ) : null}
          <AuctionBetStatusBadge bet={bet} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(getPriceWithVat(bet))}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              с НДС
            </span>
          </p>
          <p className="mt-1 text-base font-semibold">
            {formatPrice(getPriceWithoutVat(bet))}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              без НДС
            </span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 border-t">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Clock3Icon className="size-4 shrink-0 text-primary" />
          {createdAt ? (
            <>
              <span className="text-base font-semibold text-foreground">
                {createdAt.time}
              </span>
              <span className="text-xs text-muted-foreground">
                {createdAt.date}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Не указано</span>
          )}
        </span>
        {hasDetails ? <AuctionBetDetailsPopover bet={bet} /> : null}
      </CardFooter>
    </Card>
  )
}

import {
  AlertCircleIcon,
  MessageSquareTextIcon,
  TrophyIcon,
} from "lucide-react"

import type { AuctionBet } from "@/entities/auction"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

type AuctionBetStatus = {
  label: string
  variant: "success" | "destructive" | "secondary"
}

function getAuctionBetStatus(bet: AuctionBet): AuctionBetStatus | undefined {
  if (bet.is_win) {
    return { label: "Победитель", variant: "success" }
  }

  if (bet.cancel_reason?.trim()) {
    return { label: "Отменена", variant: "destructive" }
  }

  if (bet.is_rejected) {
    return { label: "Отклонена", variant: "destructive" }
  }

  if (bet.is_counter) {
    return { label: "Встречная", variant: "secondary" }
  }

  return undefined
}

export function getAuctionBetRowTone(bet: AuctionBet): string | undefined {
  if (bet.is_win) {
    return "bg-emerald-500/5 dark:bg-emerald-500/10"
  }

  return bet.cancel_reason?.trim() || bet.is_rejected
    ? "bg-destructive/5"
    : undefined
}

export function AuctionBetStatusBadge({ bet }: { bet: AuctionBet }) {
  const status = getAuctionBetStatus(bet)

  if (!status) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  return (
    <Badge variant={status.variant} className="h-7 px-3 text-xs">
      {status.variant === "success" ? <TrophyIcon /> : null}
      {status.label}
    </Badge>
  )
}

function AuctionBetDetails({ bet }: { bet: AuctionBet }) {
  const transporterComment = bet.transporter_comment?.trim()
  const cancelReason = bet.cancel_reason?.trim()

  return (
    <div className="grid gap-4 whitespace-normal">
      {transporterComment ? (
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <MessageSquareTextIcon className="size-4 shrink-0 text-primary" />
            <p className="font-semibold">Комментарий перевозчика</p>
          </div>
          <p className="mt-1 text-muted-foreground">{transporterComment}</p>
        </div>
      ) : null}
      {cancelReason ? (
        <div className="text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="size-4 shrink-0" />
            <p className="font-semibold">Причина отмены</p>
          </div>
          <p className="mt-1">{cancelReason}</p>
        </div>
      ) : null}
    </div>
  )
}

export function AuctionBetDetailsPopover({ bet }: { bet: AuctionBet }) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 border-primary/30 bg-primary/5 px-3 text-xs text-primary hover:bg-primary/10 hover:text-primary"
          />
        }
      >
        Подробнее
      </PopoverTrigger>
      <PopoverContent align="end" className="w-70 p-4">
        <AuctionBetDetails bet={bet} />
      </PopoverContent>
    </Popover>
  )
}

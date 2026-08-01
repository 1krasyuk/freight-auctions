import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react"
import { Link, Outlet, useParams } from "@tanstack/react-router"

import { useTheme } from "@/app/providers/theme-provider"
import { useAuctionDetail } from "@/entities/auction"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { AuctionDetailHeader } from "./auction-detail-header"
import { AuctionDetailPending } from "./auction-detail-page"

export function AuctionDetailLayout() {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" })
  const { theme, setTheme } = useTheme()
  const auctionQuery = useAuctionDetail(auctionUuid)
  const auction = auctionQuery.data

  if (!auction) {
    return <AuctionDetailPending />
  }

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

      <AuctionDetailHeader auction={auction} />
      <Outlet />
    </main>
  )
}

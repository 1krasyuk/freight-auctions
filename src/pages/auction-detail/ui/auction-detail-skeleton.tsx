import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { useTheme } from "@/app/providers/theme-provider"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Separator } from "@/shared/ui/separator"
import { Skeleton } from "@/shared/ui/skeleton"
import { Switch } from "@/shared/ui/switch"

const cardClassName =
  "[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]"

function SectionHeadingSkeleton() {
  return (
    <CardHeader className="flex! flex-row items-center gap-3">
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
  )
}

function RouteSkeleton() {
  return (
    <Card className={cardClassName}>
      <SectionHeadingSkeleton />
      <CardContent className="space-y-3">
        {[0, 1].map((point) => (
          <div key={point} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3 rounded-xl bg-muted/40 p-4">
              <div className="flex justify-between gap-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full max-w-72" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ContentCardSkeleton() {
  return (
    <Card className={cardClassName}>
      <SectionHeadingSkeleton />
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {["w-20", "w-24", "w-16"].map((width) => (
            <div key={width} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className={`h-4 ${width}`} />
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

function TradingSkeleton() {
  return (
    <Card className={cardClassName}>
      <SectionHeadingSkeleton />
      <CardContent className="space-y-5">
        <Skeleton className="h-28 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <Separator />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  )
}

export function AuctionDetailSkeleton() {
  const { theme, setTheme } = useTheme()

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
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full max-w-80" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="order-2 space-y-5 lg:order-1">
          <RouteSkeleton />
          <ContentCardSkeleton />
          <ContentCardSkeleton />
        </div>
        <aside className="order-1 lg:order-2">
          <TradingSkeleton />
        </aside>
      </div>
    </main>
  )
}

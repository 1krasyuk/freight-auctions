import { CalendarClockIcon, EyeOffIcon, GavelIcon } from "lucide-react"

import type { AuctionDetail } from "@/entities/auction"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"

type AuctionTradingCardProps = {
  trading: AuctionDetail["trading"]
  currencyCode: string | undefined
}

const bidMeasurementLabels: Record<string, string> = {
  PerRoute: "За рейс",
  PerKm: "За километр",
  Unknown: "Не указано",
}

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

function formatDateTime(value: string | undefined): string {
  if (!value) return "Не указано"

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Не указано"
    : dateTimeFormatter.format(date)
}

function formatPrice(
  value: number | null | undefined,
  currencyCode: string | undefined
): string {
  if (value == null) return "Не указана"

  if (currencyCode === "643") {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formattedValue = value.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  })
  return currencyCode ? `${formattedValue} · ${currencyCode}` : formattedValue
}

export function AuctionTradingCard({
  trading,
  currencyCode,
}: AuctionTradingCardProps) {
  const price = trading.price
  const pricesAreHidden = trading.no_view_cargo_price === true

  return (
    <Card className="[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader className="flex! flex-row items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <GavelIcon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-xl">Торги и цены</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bidMeasurementLabels[trading.bid_measurement_type ?? "Unknown"]}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {pricesAreHidden ? (
          <Alert className="block p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <EyeOffIcon className="size-5" />
              <AlertTitle className="text-base font-semibold">
                Цены скрыты
              </AlertTitle>
            </div>
            <AlertDescription className="mt-1 text-sm">
              Организатор ограничил просмотр стоимости груза.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-xl bg-primary/8 p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Текущая цена
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
                {formatPrice(price?.current, currencyCode)}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Доступная цена:{" "}
                <span className="font-bold text-primary">
                  {formatPrice(price?.available, currencyCode)}
                </span>
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Стартовая", price?.start],
                ["Шаг ставки", price?.step],
                ["Минимальная", price?.min],
                ["Максимальная", price?.max],
                ["За километр", price?.price_per_km],
                ["Моя ставка", trading.your?.last_bet],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatPrice(
                      value as number | null | undefined,
                      currencyCode
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <CalendarClockIcon className="size-5 text-primary" />
            Время торгов
          </div>
          <dl className="grid gap-2 text-sm sm:gap-3">
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-2">
              <dt className="text-muted-foreground">Начало</dt>
              <dd className="font-medium">
                {formatDateTime(trading.start_time)}
              </dd>
            </div>
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-2">
              <dt className="text-muted-foreground">Окончание</dt>
              <dd className="font-medium">
                {formatDateTime(trading.stop_time)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={trading.can_set_bet ? "default" : "secondary"}>
            {trading.can_set_bet ? "Ставка доступна" : "Ставка недоступна"}
          </Badge>
          <Badge variant="outline">
            {trading.your?.bet ? "Своя ставка есть" : "Своей ставки нет"}
          </Badge>
          {trading.allow_counter_bets ? (
            <Badge variant="outline">Встречные ставки разрешены</Badge>
          ) : null}
        </div>

        {trading.settings ? (
          <>
            <Separator />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">
                  Продление после ставки
                </dt>
                <dd className="font-medium">
                  {trading.settings.prolong_after_bet == null
                    ? "Не указано"
                    : `${trading.settings.prolong_after_bet} мин`}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Время на передачу</dt>
                <dd className="font-medium">
                  {trading.settings.transmission_time_in == null
                    ? "Не указано"
                    : `${trading.settings.transmission_time_in} ч`}
                </dd>
              </div>
            </dl>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

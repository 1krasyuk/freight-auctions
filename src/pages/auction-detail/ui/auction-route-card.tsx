import {
  CalendarDaysIcon,
  MapPinIcon,
  PackageIcon,
  UserRoundIcon,
} from "lucide-react"

import type { AuctionDetail } from "@/entities/auction"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

type AuctionRouteCardProps = {
  routes: AuctionDetail["routes"]
  hidePrivateData: boolean
}

const operationLabels: Record<string, string> = {
  Loading: "Погрузка",
  Unloading: "Выгрузка",
  Unknown: "Точка маршрута",
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
})

function formatDateTime(value: string | undefined) {
  if (!value) return { date: "Не указано", time: "" }

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? { date: "Не указано", time: "" }
    : { date: dateFormatter.format(date), time: timeFormatter.format(date) }
}

export function AuctionRouteCard({
  routes,
  hidePrivateData,
}: AuctionRouteCardProps) {
  return (
    <Card className="[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader className="flex! flex-row items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MapPinIcon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-xl">Маршрут</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Точек: {routes.length}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {routes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Маршрут не указан.</p>
        ) : (
          <ol>
            {routes.map((point, index) => {
              const pointKey = `${point.row_num ?? index}-${point.op_type ?? "Unknown"}`
              const startDate = formatDateTime(point.start_date)
              const endDate = formatDateTime(point.end_date)
              const cargoDetails = [
                point.cargo?.name,
                point.cargo?.weight ? `${point.cargo.weight} т` : undefined,
                point.cargo?.volume ? `${point.cargo.volume} м³` : undefined,
              ].filter(Boolean)

              return (
                <li
                  key={pointKey}
                  className="relative grid grid-cols-[1.75rem_1fr] gap-2 pb-4 last:pb-0 sm:grid-cols-[2rem_1fr] sm:gap-3 sm:pb-6"
                >
                  {index < routes.length - 1 ? (
                    <span className="absolute top-7 bottom-0 left-3.5 w-px bg-border sm:top-8 sm:left-4" />
                  ) : null}
                  <div className="z-10 flex size-7 items-center justify-center rounded-full border bg-background text-xs font-bold text-primary sm:size-8 sm:text-sm">
                    {point.row_num ?? index + 1}
                  </div>
                  <div className="min-w-0 rounded-xl bg-muted/45 p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold">
                        {point.location?.city_name ?? "Город не указан"}
                      </h3>
                      <Badge variant="outline">
                        {operationLabels[point.op_type ?? "Unknown"]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <CalendarDaysIcon className="mt-0.5 size-4 shrink-0" />
                      <span className="hidden sm:inline">
                        {startDate.date} {startDate.time} — {endDate.date}{" "}
                        {endDate.time}
                      </span>
                      <span className="grid min-w-0 grid-cols-[1.5rem_1fr] gap-x-2 gap-y-1 sm:hidden">
                        <span>С</span>
                        <span className="font-medium text-foreground">
                          {startDate.date}
                          {startDate.time ? ` ${startDate.time}` : ""}
                        </span>
                        <span>До</span>
                        <span className="font-medium text-foreground">
                          {endDate.date}
                          {endDate.time ? ` ${endDate.time}` : ""}
                        </span>
                      </span>
                    </div>

                    {hidePrivateData ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Адрес и контакты скрыты организатором.
                      </p>
                    ) : (
                      <div className="mt-3 grid divide-y text-sm sm:grid-cols-2 sm:gap-4 sm:divide-y-0">
                        <div className="pb-2 sm:pb-0">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPinIcon className="size-4 shrink-0" />
                            <p>Адрес</p>
                          </div>
                          <p className="mt-0.5 font-medium">
                            {point.location?.loading_address || "Не указан"}
                          </p>
                        </div>
                        <div className="pt-2 sm:pt-0">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <UserRoundIcon className="size-4 shrink-0" />
                            <p>Контакт на точке</p>
                          </div>
                          <p className="mt-0.5 font-medium">
                            {[point.contact?.name, point.contact?.phone]
                              .filter(Boolean)
                              .join(" · ") || "Не указан"}
                          </p>
                        </div>
                      </div>
                    )}

                    {cargoDetails.length > 0 ? (
                      <div className="mt-2 flex items-start gap-2 border-t pt-3 text-sm font-medium">
                        <PackageIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <p>{cargoDetails.join(" · ")}</p>
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

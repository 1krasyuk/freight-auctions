import { PackageIcon, TruckIcon } from "lucide-react"

import type { AuctionDetail } from "@/entities/auction"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"

type AuctionCargoCardProps = {
  cargo: AuctionDetail["cargo"]
  routes: AuctionDetail["routes"]
}

const loadingTypeLabels = {
  side: "Боковая",
  top: "Верхняя",
  rear: "Задняя",
  full: "Полная растентовка",
} as const

const documentLabels = {
  tir: "TIR",
  cmr: "CMR",
  t1: "T1",
  med: "Медкнижка",
} as const

function formatNumber(value: number | null | undefined, suffix: string) {
  return value == null
    ? "Не указано"
    : `${value.toLocaleString("ru-RU")} ${suffix}`
}

export function AuctionCargoCard({ cargo, routes }: AuctionCargoCardProps) {
  const routeCargo = routes.find((point) => point.cargo)?.cargo
  const loadingTypes = Object.entries(cargo.loading_types ?? {})
    .filter(([, enabled]) => enabled)
    .map(([type]) => loadingTypeLabels[type as keyof typeof loadingTypeLabels])
  const documents = Object.entries(cargo.docs ?? {})
    .filter(([, required]) => required)
    .map(
      ([document]) => documentLabels[document as keyof typeof documentLabels]
    )
  const temperature =
    cargo.temp_from == null && cargo.temp_to == null
      ? "Не указана"
      : `${cargo.temp_from ?? "—"}…${cargo.temp_to ?? "—"} °C`
  const dimensions =
    cargo.car?.length == null &&
    cargo.car?.width == null &&
    cargo.car?.height == null
      ? "Не указаны"
      : `${cargo.car?.length ?? "—"} × ${cargo.car?.width ?? "—"} × ${cargo.car?.height ?? "—"} м`
  const specialRequirements = [
    cargo.containered
      ? ["Контейнер", cargo.container_type, cargo.container_size]
          .filter(Boolean)
          .join(" · ")
      : undefined,
    cargo.conics == null ? undefined : `Коники: ${cargo.conics}`,
    cargo.belts == null ? undefined : `Ремни: ${cargo.belts}`,
    cargo.adr == null ? undefined : `ADR: ${cargo.adr}`,
    cargo.coupling ? "Сцепка" : undefined,
    cargo.air_pass ? "Пневмоход" : undefined,
    cargo.low_loader ? "Низкорамник" : undefined,
    cargo.additional_load ? "Догруз" : undefined,
    cargo.is_international ? "Международная перевозка" : undefined,
  ].filter((requirement): requirement is string => Boolean(requirement))

  return (
    <Card className="[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader className="flex! flex-row items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <PackageIcon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-xl">Груз и транспорт</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {routeCargo?.name ?? "Наименование не указано"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-4 lg:flex lg:w-fit lg:gap-10 lg:[&>div]:relative lg:[&>div:not(:first-child)]:before:absolute lg:[&>div:not(:first-child)]:before:top-1/2 lg:[&>div:not(:first-child)]:before:-left-6 lg:[&>div:not(:first-child)]:before:-translate-y-1/2 lg:[&>div:not(:first-child)]:before:text-xl lg:[&>div:not(:first-child)]:before:leading-none lg:[&>div:not(:first-child)]:before:text-muted-foreground lg:[&>div:not(:first-child)]:before:content-['·']">
          <div>
            <dt className="text-sm text-muted-foreground">Вес</dt>
            <dd className="mt-0.5 font-semibold">
              {routeCargo?.weight ? `${routeCargo.weight} т` : "Не указано"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Объём</dt>
            <dd className="mt-0.5 font-semibold">
              {routeCargo?.volume ? `${routeCargo.volume} м³` : "Не указано"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Расстояние</dt>
            <dd className="mt-0.5 font-semibold">
              {formatNumber(cargo.distance, "км")}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Температура</dt>
            <dd className="mt-0.5 font-semibold">{temperature}</dd>
          </div>
        </dl>

        <Separator />

        <section>
          <div className="flex items-center gap-2">
            <TruckIcon className="size-5 text-primary" />
            <h3 className="text-base font-semibold">Требования к ТС</h3>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Тип ТС</dt>
              <dd className="font-medium">{cargo.car?.type ?? "Не указан"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Тип кузова</dt>
              <dd className="font-medium">{cargo.body_type ?? "Не указан"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Количество машин</dt>
              <dd className="font-medium">
                {cargo.truck_count ?? "Не указано"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Грузоподъёмность</dt>
              <dd className="font-medium">
                {formatNumber(cargo.car?.weight, "т")}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Вместимость</dt>
              <dd className="font-medium">
                {formatNumber(cargo.car?.volume, "м³")}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Габариты Д × Ш × В</dt>
              <dd className="font-medium">{dimensions}</dd>
            </div>
          </dl>
        </section>

        <Separator />

        <section className="grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:w-fit sm:items-start sm:gap-x-10">
          <div>
            <h3 className="text-base font-semibold">Типы загрузки</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {loadingTypes.length > 0 ? (
                loadingTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Не указаны
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold">Документы</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <Badge key={document} variant="outline">
                    {document}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Не требуются
                </span>
              )}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base font-semibold">
              Дополнительные требования
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {specialRequirements.length > 0 ? (
                specialRequirements.map((requirement) => (
                  <Badge key={requirement} variant="outline">
                    {requirement}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Не указаны
                </span>
              )}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

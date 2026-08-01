import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { endOfDay, format, startOfDay } from "date-fns"
import { ru } from "date-fns/locale"
import {
  CalendarDaysIcon,
  ChevronUpIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import type { DateRange } from "react-day-picker"
import { z } from "zod"

import {
  AUCTION_TYPES,
  TRADING_STATUSES,
  type AuctionListSearch,
} from "../model/auction-list-search"
import {
  AUCTION_CITIES,
  AUCTION_STATUS_OPTIONS,
  AUCTION_TYPE_LABELS,
  TRADING_STATUS_LABELS,
} from "../model/auction-list-filter-options"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Calendar } from "@/shared/ui/calendar"
import { cn } from "@/shared/lib/cn"

const filterFormSchema = z.object({
  cargo_num: z.string(),
  status: z.array(z.enum(TRADING_STATUSES)),
  statuses: z.array(z.number().int().min(1).max(7)),
  auc_type: z.array(z.enum(AUCTION_TYPES)),
  load_city: z.string(),
  unload_city: z.string(),
  load_date_from: z.string(),
  load_date_to: z.string(),
  is_bidder: z.enum(["all", "true", "false"]),
  current_price_from: z.string(),
  current_price_to: z.string(),
})

type FilterFormValues = z.infer<typeof filterFormSchema>

const CONTROL_CLASS_NAME = "!h-11 w-full px-3 text-sm sm:text-base"
const SELECT_ITEM_CLASS_NAME = "sm:text-sm"

function toBooleanFilter(value: "all" | "true" | "false") {
  return value === "all" ? undefined : value === "true"
}

function toOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined
  }

  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : undefined
}

function toBooleanSelectValue(value: boolean | undefined) {
  return value === undefined ? "all" : value ? "true" : "false"
}

function toFormValues(search: AuctionListSearch): FilterFormValues {
  return {
    cargo_num: search.cargo_num ?? "",
    status: search.status ?? [],
    statuses: search.statuses ?? [],
    auc_type: search.auc_type ?? [],
    load_city: search.load_city ?? "all",
    unload_city: search.unload_city ?? "all",
    load_date_from: search.load_date_from ?? "",
    load_date_to: search.load_date_to ?? "",
    is_bidder: toBooleanSelectValue(search.is_bidder),
    current_price_from:
      search.current_price_from === undefined
        ? ""
        : String(search.current_price_from),
    current_price_to:
      search.current_price_to === undefined
        ? ""
        : String(search.current_price_to),
  }
}

function toDate(value: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDateRange(range: DateRange | undefined): string {
  if (!range?.from) {
    return "Дата погрузки"
  }

  if (!range.to) {
    return `С ${format(range.from, "d MMM yyyy", { locale: ru })}`
  }

  return `${format(range.from, "d MMM", { locale: ru })} — ${format(range.to, "d MMM yyyy", { locale: ru })}`
}

function getAdvancedFilterCount(search: AuctionListSearch): number {
  return [
    search.status?.length ? true : undefined,
    search.statuses?.length ? true : undefined,
    search.auc_type?.length ? true : undefined,
  ].filter(Boolean).length
}

function getMobileFilterCount(search: AuctionListSearch): number {
  const quickFilterCount = [
    search.load_city ? true : undefined,
    search.unload_city ? true : undefined,
    search.load_date_from || search.load_date_to ? true : undefined,
    search.is_bidder === undefined ? undefined : true,
    search.current_price_from === undefined ? undefined : true,
    search.current_price_to === undefined ? undefined : true,
  ].filter(Boolean).length

  return getAdvancedFilterCount(search) + quickFilterCount
}

type AuctionListFiltersProps = {
  search: AuctionListSearch
  onQuickChange: (change: Partial<AuctionListSearch>) => void
  onApply: (search: AuctionListSearch) => void
}

export function AuctionListFilters({
  search,
  onQuickChange,
  onApply,
}: AuctionListFiltersProps) {
  const priceRequestTimeout = useRef<number | undefined>(undefined)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: toFormValues(search),
  })

  useEffect(() => {
    form.reset(toFormValues(search), { keepDirtyValues: true })
  }, [form, search])

  useEffect(
    () => () => {
      window.clearTimeout(priceRequestTimeout.current)
    },
    []
  )

  const [loadDateFrom, loadDateTo] = useWatch({
    control: form.control,
    name: ["load_date_from", "load_date_to"],
  })
  const selectedDateRange: DateRange | undefined =
    loadDateFrom || loadDateTo
      ? { from: toDate(loadDateFrom), to: toDate(loadDateTo) }
      : undefined

  function applySearch(values: FilterFormValues) {
    onQuickChange({ cargo_num: values.cargo_num.trim() || undefined })
  }

  function changePrice(
    name: "current_price_from" | "current_price_to",
    value: string,
    applyImmediately: boolean
  ) {
    if (!applyImmediately) {
      return
    }

    window.clearTimeout(priceRequestTimeout.current)
    priceRequestTimeout.current = window.setTimeout(() => {
      const currentPriceFrom =
        name === "current_price_from"
          ? value
          : form.getValues("current_price_from")
      const currentPriceTo =
        name === "current_price_to" ? value : form.getValues("current_price_to")

      onQuickChange({
        current_price_from: toOptionalNumber(currentPriceFrom),
        current_price_to: toOptionalNumber(currentPriceTo),
      })
    }, 400)
  }

  function changeDateRange(
    range: DateRange | undefined,
    applyImmediately: boolean
  ) {
    const loadDateFromValue = range?.from
      ? startOfDay(range.from).toISOString()
      : undefined
    const loadDateToValue = range?.to
      ? endOfDay(range.to).toISOString()
      : undefined

    form.setValue("load_date_from", loadDateFromValue ?? "", {
      shouldDirty: true,
    })
    form.setValue("load_date_to", loadDateToValue ?? "", {
      shouldDirty: true,
    })

    if (applyImmediately) {
      onQuickChange({
        load_date_from: loadDateFromValue,
        load_date_to: loadDateToValue,
      })
    }
  }

  function applyAdvancedFilters(values: FilterFormValues) {
    onApply({
      page: 1,
      per_page: search.per_page,
      cargo_num: values.cargo_num.trim() || undefined,
      load_city: values.load_city === "all" ? undefined : values.load_city,
      unload_city:
        values.unload_city === "all" ? undefined : values.unload_city,
      load_date_from: values.load_date_from || undefined,
      load_date_to: values.load_date_to || undefined,
      status: values.status.length > 0 ? values.status : undefined,
      statuses: values.statuses.length > 0 ? values.statuses : undefined,
      auc_type: values.auc_type.length > 0 ? values.auc_type : undefined,
      is_bidder: toBooleanFilter(values.is_bidder),
      current_price_from: toOptionalNumber(values.current_price_from),
      current_price_to: toOptionalNumber(values.current_price_to),
    })
  }

  function resetFilters() {
    window.clearTimeout(priceRequestTimeout.current)
    const resetSearch: AuctionListSearch = {
      page: 1,
      per_page: search.per_page,
    }

    form.reset(toFormValues(resetSearch))
    onApply(resetSearch)
  }

  const advancedFilterCount = getAdvancedFilterCount(search)
  const mobileFilterCount = getMobileFilterCount(search)

  function renderFilterControls(layout: "desktop" | "mobile") {
    const applyImmediately = layout === "desktop"

    return (
      <div
        className={cn(
          layout === "desktop"
            ? "hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-[0.8fr_1fr_1fr_1.3fr_auto]"
            : "grid grid-cols-2 gap-2 sm:hidden"
        )}
      >
        <Controller
          control={form.control}
          name="is_bidder"
          render={({ field }) => (
            <div className={cn(layout === "mobile" && "order-1")}>
              <Select
                modal={false}
                value={field.value}
                onValueChange={(value) => {
                  const nextValue = value ?? "all"
                  field.onChange(nextValue)

                  if (applyImmediately) {
                    onQuickChange({
                      is_bidder: toBooleanFilter(nextValue),
                    })
                  }
                }}
              >
                <SelectTrigger className={CONTROL_CLASS_NAME}>
                  <SelectValue>
                    {field.value === "all"
                      ? "Участие"
                      : field.value === "true"
                        ? "Участвую"
                        : "Не участвую"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className={SELECT_ITEM_CLASS_NAME} value="all">
                    Любое участие
                  </SelectItem>
                  <SelectItem className={SELECT_ITEM_CLASS_NAME} value="true">
                    Участвую
                  </SelectItem>
                  <SelectItem className={SELECT_ITEM_CLASS_NAME} value="false">
                    Не участвую
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {(["load_city", "unload_city"] as const).map((name, index) => (
          <Controller
            key={`${layout}-${name}`}
            control={form.control}
            name={name}
            render={({ field }) => (
              <div
                className={cn(
                  layout === "mobile" && (index === 0 ? "order-3" : "order-4")
                )}
              >
                <Select
                  modal={false}
                  value={field.value}
                  onValueChange={(value) => {
                    const nextValue = value ?? "all"
                    field.onChange(nextValue)

                    if (applyImmediately) {
                      onQuickChange({
                        [name]: nextValue === "all" ? undefined : nextValue,
                      })
                    }
                  }}
                >
                  <SelectTrigger className={CONTROL_CLASS_NAME}>
                    <SelectValue>
                      {field.value === "all"
                        ? name === "load_city"
                          ? "Откуда"
                          : "Куда"
                        : field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className={SELECT_ITEM_CLASS_NAME} value="all">
                      Все города
                    </SelectItem>
                    {AUCTION_CITIES.map((city) => (
                      <SelectItem
                        key={city}
                        value={city}
                        className={SELECT_ITEM_CLASS_NAME}
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        ))}

        <div
          className={cn(
            "grid grid-cols-2 gap-2",
            layout === "mobile" && "order-5 col-span-2"
          )}
        >
          {(["current_price_from", "current_price_to"] as const).map((name) => (
            <Controller
              key={`${layout}-${name}`}
              control={form.control}
              name={name}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="any"
                  min="0"
                  className={cn(
                    CONTROL_CLASS_NAME,
                    "md:text-base",
                    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  )}
                  aria-label={
                    name === "current_price_from" ? "Цена от" : "Цена до"
                  }
                  placeholder={
                    name === "current_price_from" ? "Цена от" : "Цена до"
                  }
                  onChange={(event) => {
                    field.onChange(event)
                    changePrice(name, event.target.value, applyImmediately)
                  }}
                />
              )}
            />
          ))}
        </div>

        <div className={cn("min-w-0", layout === "mobile" && "order-2")}>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11! w-full justify-start bg-input/50 px-3 text-sm font-normal hover:bg-input sm:text-base xl:w-auto xl:px-10"
                />
              }
            >
              <CalendarDaysIcon />
              <span className="truncate">
                {formatDateRange(selectedDateRange)}
              </span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-50 p-0">
              <Calendar
                mode="range"
                locale={ru}
                selected={selectedDateRange}
                onSelect={(range) => changeDateRange(range, applyImmediately)}
              />
              {selectedDateRange ? (
                <div className="border-t p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-full text-sm"
                    onClick={() => changeDateRange(undefined, applyImmediately)}
                  >
                    Очистить даты
                  </Button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-card/95 shadow-sm">
      <CardContent>
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <form className="space-y-4" onSubmit={form.handleSubmit(applySearch)}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <Controller
                control={form.control}
                name="cargo_num"
                render={({ field }) => (
                  <div className="relative">
                    <Label htmlFor="auction-search" className="sr-only">
                      Поиск по номеру заявки
                    </Label>
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="auction-search"
                      className="h-12 rounded-lg pr-4 pl-12 text-base md:text-base"
                      placeholder="Введите номер заявки"
                      autoComplete="off"
                    />
                  </div>
                )}
              />
              <CollapsibleTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="col-span-2 row-start-2 h-11 w-full bg-input/50 px-4 text-sm hover:bg-input sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-12 sm:w-auto sm:text-base"
                  />
                }
              >
                <SlidersHorizontalIcon />
                <span className="sm:hidden">
                  Расширенные
                  {mobileFilterCount > 0 ? `: ${mobileFilterCount}` : ""}
                </span>
                <span className="hidden sm:inline">
                  Расширенные
                  {advancedFilterCount > 0 ? `: ${advancedFilterCount}` : ""}
                </span>
              </CollapsibleTrigger>
              <Button
                type="submit"
                className="col-start-2 row-start-1 h-12 px-4 text-sm sm:col-start-3 sm:px-7 sm:text-base"
              >
                Найти
              </Button>
            </div>

            {renderFilterControls("desktop")}

            <CollapsibleContent className="border-t pt-4">
              {renderFilterControls("mobile")}

              <div className="mt-4 border-t pt-4">
                <div className="grid gap-0 lg:grid-cols-3">
                  <Controller
                    control={form.control}
                    name="auc_type"
                    render={({ field }) => (
                      <fieldset className="space-y-3 pb-5 lg:pr-6 lg:pb-0">
                        <legend className="text-sm font-semibold">
                          Тип аукциона
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          {AUCTION_TYPES.map((type) => (
                            <Label
                              key={type}
                              className="flex items-center gap-2 text-sm font-medium"
                            >
                              <Checkbox
                                checked={field.value.includes(type)}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked
                                      ? [...field.value, type]
                                      : field.value.filter(
                                          (value) => value !== type
                                        )
                                  )
                                }
                              />
                              {AUCTION_TYPE_LABELS[type]}
                            </Label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <fieldset className="space-y-3 border-t py-5 lg:border-t-0 lg:border-l lg:px-6 lg:py-0">
                        <legend className="text-sm font-semibold">
                          Мой статус
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          {TRADING_STATUSES.map((status) => (
                            <Label
                              key={status}
                              className="flex items-center gap-2 text-sm font-medium"
                            >
                              <Checkbox
                                checked={field.value.includes(status)}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked
                                      ? [...field.value, status]
                                      : field.value.filter(
                                          (value) => value !== status
                                        )
                                  )
                                }
                              />
                              {TRADING_STATUS_LABELS[status]}
                            </Label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="statuses"
                    render={({ field }) => (
                      <fieldset className="space-y-3 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                        <legend className="text-sm font-semibold">
                          Статус аукциона
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          {AUCTION_STATUS_OPTIONS.map((status) => (
                            <Label
                              key={status.value}
                              className="flex items-center gap-2 text-sm font-medium"
                            >
                              <Checkbox
                                checked={field.value.includes(status.value)}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked
                                      ? [...field.value, status.value]
                                      : field.value.filter(
                                          (value) => value !== status.value
                                        )
                                  )
                                }
                              />
                              {status.label}
                            </Label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  />
                </div>

                <div className="mt-4 flex flex-nowrap items-center gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 px-2 text-xs sm:h-10 sm:text-sm"
                    onClick={() => setIsAdvancedOpen(false)}
                  >
                    <ChevronUpIcon />
                    Свернуть
                  </Button>
                  <div className="ml-auto flex gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-2.5 text-xs sm:h-10 sm:px-4 sm:text-sm"
                      onClick={resetFilters}
                    >
                      Очистить
                    </Button>
                    <Button
                      type="button"
                      className="h-9 px-3 text-xs sm:h-10 sm:px-5 sm:text-sm"
                      onClick={form.handleSubmit(applyAdvancedFilters)}
                    >
                      Применить
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </form>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

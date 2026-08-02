import { useCallback, useEffect, useState } from "react"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"

import { AuctionCard, useAuctionList } from "@/entities/auction"
import {
  buildAuctionListRequest,
  type AuctionListSearch,
} from "../model/auction-list-search"
import { AUCTION_LIST_SORT_OPTIONS } from "../model/auction-list-filter-options"
import { AuctionListFilters } from "./auction-list-filters"
import { AuctionListSkeleton } from "./auction-list-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { ThemeToggle } from "@/shared/ui/theme-toggle"

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

type PaginationEntry = number | "ellipsis-start" | "ellipsis-end"

function getPaginationEntries(
  currentPage: number,
  lastPage: number
): PaginationEntry[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1)
  }

  const visiblePages = [
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    lastPage,
  ]
    .filter((page) => page >= 1 && page <= lastPage)
    .filter((page, index, pages) => pages.indexOf(page) === index)
    .sort((left, right) => left - right)
  const entries: PaginationEntry[] = []

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1]

    if (previousPage !== undefined && page - previousPage === 2) {
      entries.push(previousPage + 1)
    } else if (previousPage !== undefined && page - previousPage > 2) {
      entries.push(index === 1 ? "ellipsis-start" : "ellipsis-end")
    }

    entries.push(page)
  })

  return entries
}

function getPageHref(page: number): string {
  const url = new URL(window.location.href)

  url.searchParams.set("page", String(page))

  return `${url.pathname}${url.search}`
}

export function AuctionListPage() {
  const search = useSearch({ from: "/" })
  const navigate = useNavigate({ from: "/" })
  const [currentTime, setCurrentTime] = useState(Date.now)
  const request = buildAuctionListRequest(search)
  const auctionsQuery = useAuctionList(request)
  const items = auctionsQuery.data?.data ?? []
  const meta = auctionsQuery.data?.meta
  const lastPage = meta?.last_page ?? 1
  const currentPage = Math.min(
    Math.max(meta?.current_page ?? search.page, 1),
    lastPage
  )
  const paginationEntries = getPaginationEntries(currentPage, lastPage)
  const rangeStart =
    meta?.from ??
    (currentPage - 1) * search.per_page + (items.length > 0 ? 1 : 0)
  const rangeEnd = meta?.to ?? rangeStart + Math.max(items.length - 1, 0)
  const rangeLabel =
    rangeStart === rangeEnd ? String(rangeStart) : `${rangeStart}–${rangeEnd}`
  const selectedSortLabel =
    AUCTION_LIST_SORT_OPTIONS.find(
      (option) => option.value === (search.sort ?? "newest")
    )?.label ?? AUCTION_LIST_SORT_OPTIONS[0].label

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  const setSearch = useCallback(
    (nextSearch: AuctionListSearch) => {
      void navigate({ search: nextSearch })
    },
    [navigate]
  )

  const changeQuickFilters = useCallback(
    (change: Partial<AuctionListSearch>) => {
      void navigate({
        search: (previousSearch) => ({
          ...previousSearch,
          ...change,
          page: 1,
        }),
      })
    },
    [navigate]
  )

  function setPage(page: number) {
    setSearch({ ...search, page })
  }

  function setPageSize(perPage: number) {
    setSearch({ ...search, page: 1, per_page: perPage })
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-muted/30">
      <div className="mx-auto w-full max-w-6xl min-w-0 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative sm:py-1">
          <div className="flex items-center justify-between gap-4">
            <p className="sm:xl text-sm font-bold tracking-wider text-primary">
              Умный Логист
            </p>
            <ThemeToggle />
          </div>
          <div className="mt-3 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Поиск грузовых аукционов
            </h1>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              Поиск подходящих грузов и управление ставками в одном месте.
            </p>
          </div>
          <div className="mt-3 h-px bg-linear-to-r from-primary/70 via-border to-transparent" />
        </header>

        <AuctionListFilters
          search={search}
          onQuickChange={changeQuickFilters}
          onApply={setSearch}
        />

        {auctionsQuery.isPending ? <AuctionListSkeleton /> : null}

        {auctionsQuery.isError && items.length === 0 ? (
          <Alert
            variant="destructive"
            className="grid-cols-[auto_1fr] items-center gap-x-3 border-destructive/20 bg-destructive/5 p-4 shadow-sm sm:p-5"
          >
            <div className="row-span-2 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircleIcon className="size-5" />
            </div>
            <AlertTitle className="col-start-2 text-base font-semibold">
              Не удалось загрузить аукционы
            </AlertTitle>
            <AlertDescription className="col-start-2 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span>Проверьте соединение и повторите запрос.</span>
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm"
                onClick={() => void auctionsQuery.refetch()}
              >
                <RefreshCwIcon />
                Повторить
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {auctionsQuery.isSuccess && items.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
              <h2 className="text-base font-medium">Аукционы не найдены</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Измените или сбросьте фильтры, чтобы увидеть другие предложения.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {items.length > 0 ? (
          <section
            className="min-w-0 space-y-3"
            aria-labelledby="auction-list-heading"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-2 sm:flex sm:px-5">
              <h2
                id="auction-list-heading"
                className="text-xl font-semibold tracking-tight"
              >
                Доступные аукционы
              </h2>
              <Select
                value={search.sort ?? "newest"}
                onValueChange={(value) => {
                  const selectedSort = AUCTION_LIST_SORT_OPTIONS.find(
                    (option) => option.value === value
                  )?.value

                  if (selectedSort) {
                    changeQuickFilters({ sort: selectedSort })
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Сортировка аукционов"
                  className="col-span-2 row-start-2 h-10 w-full bg-background px-3 text-sm sm:w-70 sm:text-base"
                >
                  <SelectValue>{selectedSortLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent align="start" className="min-w-60">
                  {AUCTION_LIST_SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="sm:text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {meta?.total !== undefined ? (
                <span className="col-start-2 row-start-1 ml-auto shrink-0 text-sm text-muted-foreground">
                  Найдено: {meta.total.toLocaleString("ru-RU")}
                </span>
              ) : null}
            </div>
            <ul className="grid min-w-0 gap-4">
              {items.map((auction, index) => (
                <li
                  className="min-w-0"
                  key={auction.main?.order_uid ?? auction.main?.id ?? index}
                >
                  <AuctionCard auction={auction} currentTime={currentTime} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {meta && items.length > 0 ? (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-2 sm:grid-cols-[1fr_auto_1fr] sm:px-5">
            <p className="text-sm text-muted-foreground">
              Показано {rangeLabel} из{" "}
              {(meta.total ?? items.length).toLocaleString("ru-RU")}
            </p>

            <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end text-sm sm:col-start-3">
              <span className="font-medium whitespace-nowrap">На странице</span>
              <Select
                value={String(search.per_page)}
                onValueChange={(value) => {
                  const pageSize = PAGE_SIZE_OPTIONS.find(
                    (option) => String(option) === value
                  )

                  if (pageSize) {
                    setPageSize(pageSize)
                  }
                }}
              >
                <SelectTrigger
                  aria-label="Количество аукционов на странице"
                  className="h-8 w-16 bg-background px-2 text-sm sm:text-base"
                >
                  <SelectValue>{search.per_page}</SelectValue>
                </SelectTrigger>
                <SelectContent side="top" align="start">
                  {PAGE_SIZE_OPTIONS.map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={String(pageSize)}
                      className="sm:text-sm"
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {lastPage > 1 ? (
              <Pagination className="col-span-2 row-start-2 mx-0 w-auto justify-center sm:col-span-1 sm:col-start-2 sm:row-start-1">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={getPageHref(Math.max(1, currentPage - 1))}
                      text=""
                      aria-label="Предыдущая страница"
                      aria-disabled={currentPage <= 1}
                      tabIndex={currentPage <= 1 ? -1 : undefined}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none size-7 p-0! opacity-50"
                          : "size-7 p-0!"
                      }
                      onClick={(event) => {
                        event.preventDefault()

                        if (currentPage > 1) {
                          setPage(currentPage - 1)
                        }
                      }}
                    />
                  </PaginationItem>

                  {paginationEntries.map((entry) =>
                    typeof entry === "number" ? (
                      <PaginationItem key={entry}>
                        <PaginationLink
                          href={getPageHref(entry)}
                          isActive={entry === currentPage}
                          aria-label={`Страница ${entry}`}
                          onClick={(event) => {
                            event.preventDefault()
                            setPage(entry)
                          }}
                        >
                          {entry}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={entry}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={getPageHref(Math.min(lastPage, currentPage + 1))}
                      text=""
                      aria-label="Следующая страница"
                      aria-disabled={currentPage >= lastPage}
                      tabIndex={currentPage >= lastPage ? -1 : undefined}
                      className={
                        currentPage >= lastPage
                          ? "pointer-events-none size-7 p-0! opacity-50"
                          : "size-7 p-0!"
                      }
                      onClick={(event) => {
                        event.preventDefault()

                        if (currentPage < lastPage) {
                          setPage(currentPage + 1)
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  )
}

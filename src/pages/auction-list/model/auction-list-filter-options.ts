import type { AuctionListSort } from "./auction-list-search"

export const AUCTION_LIST_SORT_OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "current-price-asc", label: "Цена: сначала ниже" },
  { value: "current-price-desc", label: "Цена: сначала выше" },
  { value: "price-per-km-asc", label: "За километр: сначала ниже" },
  { value: "price-per-km-desc", label: "За километр: сначала выше" },
] as const satisfies ReadonlyArray<{
  value: AuctionListSort
  label: string
}>

export const AUCTION_CITIES = [
  "Воронеж",
  "Екатеринбург",
  "Казань",
  "Калининград",
  "Минск",
  "Москва",
  "Новосибирск",
  "Омск",
  "Пермь",
  "Самара",
  "Тюмень",
  "Уфа",
] as const

export const TRADING_STATUS_LABELS = {
  NotParticipating: "Не участвую",
  Leading: "Лидирую",
  Losing: "Ставка перебита",
  OnPending: "На рассмотрении",
  Confirmed: "Подтверждено",
  ChoosingWinner: "Выбор победителя",
  Winner: "Победитель",
  Accepted: "Принято",
  Unknown: "Неизвестно",
} as const

export const AUCTION_STATUS_OPTIONS = [
  { value: 1, label: "Планируется" },
  { value: 2, label: "Идут торги" },
  { value: 3, label: "Выбор победителя" },
  { value: 4, label: "Ожидает сделки" },
  { value: 5, label: "В работе" },
  { value: 6, label: "Завершён" },
  { value: 7, label: "Остановлен" },
] as const

export const AUCTION_TYPE_LABELS = {
  Request: "Запрос ставок",
  Up: "На повышение",
  Down: "На понижение",
  FixPrice: "Фиксированная цена",
} as const

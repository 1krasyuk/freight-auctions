/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Торговый статус пользователя в аукционе:
 * - `NotParticipating` — не участвует (1)
 * - `Leading` — лидирует (2)
 * - `Losing` — перебит (3)
 * - `Winner` — победитель (4)
 * - `Confirmed` — подтверждён (5)
 * - `Unknown` — неизвестный статус
 * @example "NotParticipating"
 */
export enum TradingStatus {
  NotParticipating = "NotParticipating",
  Leading = "Leading",
  Losing = "Losing",
  OnPending = "OnPending",
  Confirmed = "Confirmed",
  ChoosingWinner = "ChoosingWinner",
  Winner = "Winner",
  Accepted = "Accepted",
  Unknown = "Unknown",
}

/**
 * Тип отсрочки платежа:
 * - `CalendarDays` — календарные дни (1)
 * - `WorkDays` — рабочие дни (2)
 * - `Unknown` — неизвестный тип
 * @example "CalendarDays"
 */
export enum PaymentDelayType {
  CalendarDays = "CalendarDays",
  WorkDays = "WorkDays",
  Unknown = "Unknown",
}

/**
 * Тип операции маршрутной точки:
 * - `Loading` — погрузка (1)
 * - `Unloading` — выгрузка (2)
 * - `Unknown` — неизвестный тип
 * @example "Loading"
 */
export enum OperationType {
  Loading = "Loading",
  Unloading = "Unloading",
  Unknown = "Unknown",
}

/**
 * Единица измерения ставки:
 * - `PerRoute` — за рейс (0)
 * - `PerKm` — за км (1)
 * - `Unknown` — неизвестный тип
 * @example "PerRoute"
 */
export enum BidMeasurementType {
  PerRoute = "PerRoute",
  PerKm = "PerKm",
  Unknown = "Unknown",
}

/**
 * Тип аукциона:
 * - `Request` — заявочный (1)
 * - `Up` — на повышение (2)
 * - `Down` — на понижение (3)
 * - `FixPrice` — фиксированная цена (4)
 * - `Unknown` — неизвестный тип
 * @example "Down"
 */
export enum AuctionType {
  Request = "Request",
  Up = "Up",
  Down = "Down",
  FixPrice = "FixPrice",
  Unknown = "Unknown",
}

/**
 * Статус аукциона:
 * - `Planning` — планирование (1)
 * - `Auction` — торги идут (2)
 * - `DeterminateWinner` — определение победителя (3)
 * - `WaitDeal` — ожидание сделки (4)
 * - `InProgress` — в работе (5)
 * - `Finished` — завершён (6)
 * - `Stopped` — остановлен (7)
 * - `Canceled` — отменён (8)
 * - `Unknown` — неизвестный статус
 * @example "Auction"
 */
export enum AuctionStatus {
  Planning = "Planning",
  Auction = "Auction",
  DeterminateWinner = "DeterminateWinner",
  WaitDeal = "WaitDeal",
  InProgress = "InProgress",
  Finished = "Finished",
  Stopped = "Stopped",
  Canceled = "Canceled",
  Unknown = "Unknown",
}

export interface AdmittedOrganization {
  /** @example 14 */
  id?: number;
  /** @example "9616244307" */
  inn?: string;
  /** @example true */
  is_main?: boolean;
  /** @example "ООО Перевозчик" */
  name?: string;
  /** @example "Общество с ограниченной ответственностью Перевозчик" */
  full_name?: string;
  /** @example null */
  site?: string | null;
  /** @example 13 */
  subscriber_id?: number;
  /** @example "54321" */
  subscriber_code?: string;
  /** @example null */
  subscriber_role?: string | null;
  /** @example "RU_Cargo_01" */
  infobase_code?: string;
  /** @example null */
  infobase_address?: string | null;
  /** @example null */
  nalog_key?: string | null;
  /** @example false */
  hide_me?: boolean;
  /** @example "20" */
  current_vat_rate?: string | null;
}

export interface Assembly {
  /** @example null */
  num?: string | null;
  /**
   * @format date-time
   * @example null
   */
  date?: string | null;
}

/** Главный Data-объект списка аукционов. */
export interface AuctionListItem {
  /** Основные данные аукциона. */
  main?: AuctionListItemMain;
  /** Данные организатора. */
  organizer?: AuctionListItemOrganizer;
  /** Объединенный маршрут. */
  route?: AuctionListItemRoute;
  /** Данные о грузе. */
  cargo?: AuctionListItemCargo;
  /** Данные торгов. */
  trading?: AuctionListItemTrading;
  /** Информация об оплате. */
  payment?: AuctionListItemPayment;
}

/** Данные о грузе. */
export interface AuctionListItemCargo {
  /** @example "Мороженое" */
  name?: string;
  /** @example 1 */
  weight?: number;
  /** @example 1 */
  volume?: number;
  /** @example "тентованный" */
  body_type?: string;
  /** @example 1 */
  truck_count?: number;
  /** @example true */
  is_cargo?: boolean;
  /** @example null */
  is_international?: boolean;
  /** @example null */
  containered?: boolean;
  /** @example null */
  incoterms?: string;
  /** @example null */
  conics?: number;
  /** @example null */
  belts?: number;
  /** @example null */
  adr?: number;
  /** @example null */
  coupling?: boolean;
  /** @example null */
  air_pass?: boolean;
  /** @example null */
  low_loader?: boolean;
  /** @example null */
  additional_load?: boolean;
  /** @example null */
  temp_from?: number;
  /** @example null */
  temp_to?: number;
  /** Данные о грузе. */
  loading_types?: AuctionListItemCargoLoadingType;
  /** Данные о грузе. */
  docs?: AuctionListItemCargoDocs;
  car?: AuctionListItemCargoCar | null;
}

/** Требования к ТС; null если не заданы */
export interface AuctionListItemCargoCar {
  /** @example "Тягач" */
  type?: string;
  /**
   * @format float
   * @example 20
   */
  weight?: number;
  /**
   * @format float
   * @example 82
   */
  volume?: number;
  /**
   * @format float
   * @example 2.4
   */
  width?: number;
  /**
   * @format float
   * @example 13.6
   */
  length?: number;
  /**
   * @format float
   * @example 2.7
   */
  height?: number;
}

/** Данные о грузе. */
export interface AuctionListItemCargoDocs {
  /** @example false */
  tir?: boolean;
  /** @example false */
  cmr?: boolean;
  /** @example false */
  t1?: boolean;
  /** @example false */
  med?: boolean;
}

/** Данные о грузе. */
export interface AuctionListItemCargoLoadingType {
  /** @example false */
  side?: boolean;
  /** @example false */
  top?: boolean;
  /** @example false */
  rear?: boolean;
  /** @example false */
  full?: boolean;
}

/** Основные данные аукциона. */
export interface AuctionListItemMain {
  /** @example 10 */
  id?: number;
  /** @example "00000001059" */
  cargo_num?: string;
  /** @example "2026-05-04T14:49:09" */
  cargo_date?: string;
  /**
   * Тип аукциона:
   *
   * * **Request** — заявочный (1)
   * * **Up** — на повышение (2)
   * * **Down** — на понижение (3)
   * * **FixPrice** — фиксированная цена (4)
   * * **Unknown** — неизвестный тип
   * @example "Down"
   */
  auc_type?: "Request" | "Up" | "Down" | "FixPrice" | "Unknown";
  /**
   * @format uuid
   * @example "3a05d045-0e67-4f85-b20a-de81d18bba7a"
   */
  order_uid?: string;
  /** @example "2026-05-25T11:48:20" */
  created_at?: string;
  /** @example 0 */
  priority_sort?: number;
  /** @example false */
  is_assembly?: boolean;
  /**
   * @format float
   * @example 199
   */
  price_per_km?: number | null;
}

/** Данные организатора. */
export interface AuctionListItemOrganizer {
  /** @example 98 */
  subscriber_id?: number;
  /** @example 340 */
  organization_id?: number;
  /** @example "ЛИМ" */
  organization_name?: string;
  /** @example "7703769184" */
  organization_inn?: string;
  /** @example "770301001" */
  organization_kpp?: string;
  /** @example false */
  is_hide_organization?: boolean;
}

/** Информация об оплате. */
export interface AuctionListItemPayment {
  /** @example "Безналичная с НДС" */
  form?: string;
  /**
   * Код валюты (ISO 4217 numeric)
   * @example "643"
   */
  currency_code?: string;
  /** @example null */
  consignor?: string;
  /** @example null */
  consignee?: string;
}

/** Объединенный маршрут. */
export interface AuctionListItemRoute {
  /** Точка маршрута (загрузка/разгрузка). */
  load?: AuctionListItemRoutePoint;
  /** Точка маршрута (загрузка/разгрузка). */
  unload?: AuctionListItemRoutePoint;
}

/** Точка маршрута (загрузка/разгрузка). */
export interface AuctionListItemRoutePoint {
  /** @example "Пермь" */
  city?: string;
  /** @example "Транспортная 9" */
  address?: string;
  /**
   * @format date-time
   * @example "2026-05-26T09:00:00"
   */
  date?: string;
  /** @example 59 */
  city_gc_id?: number;
  /** @example 1 */
  points_count?: number;
}

/** Данные торгов. */
export interface AuctionListItemTrading {
  /**
   * Статус аукциона:
   *
   * * **Planning** — планирование (1)
   * * **Auction** — торги идут (2)
   * * **DeterminateWinner** — определение победителя (3)
   * * **WaitDeal** — ожидание сделки (4)
   * * **InProgress** — в работе (5)
   * * **Finished** — завершён (6)
   * * **Stopped** — остановлен (7)
   * * **Canceled** — отменён (8)
   * * **Unknown** — неизвестный статус
   * @example "Auction"
   */
  status?:
    | "Planning"
    | "Auction"
    | "DeterminateWinner"
    | "WaitDeal"
    | "InProgress"
    | "Finished"
    | "Stopped"
    | "Canceled"
    | "Unknown";
  /**
   * Торговый статус пользователя в аукционе:
   *
   * * **NotParticipating** — не участвует (1)
   * * **Leading** — лидирует (2)
   * * **Losing** — перебит (3)
   * * **Winner** — победитель (4)
   * * **Confirmed** — подтверждён (5)
   * * **Unknown** — неизвестный статус
   * @example "NotParticipating"
   */
  status_mobile?:
    | "NotParticipating"
    | "Leading"
    | "Losing"
    | "Winner"
    | "Confirmed"
    | "Unknown";
  /**
   * @format date-time
   * @example "2026-05-26T09:00:00"
   */
  start_time?: string;
  /**
   * @format date-time
   * @example "2026-05-26T09:00:00"
   */
  stop_time?: string;
  /**
   * Единица измерения ставки:
   *
   * * **PerRoute** — за рейс (0)
   * * **PerKm** — за км (1)
   * * **Unknown** — неизвестный тип
   * @example "PerRoute"
   */
  bid_measurement_type?: "PerRoute" | "PerKm" | "Unknown" | null;
  /** @example false */
  can_set_bet?: boolean;
  /** @example true */
  allow_counter_bets?: boolean;
  /** @example true */
  hide_points_address_and_contacts?: boolean;
  /** @example null */
  direction?: string;
  /** @example null */
  comment?: string;
  /** @example false */
  is_bidder?: boolean;
  /** @example false */
  is_available?: boolean;
  /** @example false */
  is_accredited?: boolean;
  /** @example false */
  is_favorite?: boolean;
  price?: AuctionListItemTradingPrice | null;
  your?: AuctionListItemTradingYour | null;
  /** @example false */
  red_bet_with_vat?: boolean;
  /** @example false */
  red_bet_no_vat?: boolean;
  /** @example null */
  is_last_bet_with_vat?: boolean;
}

export interface AuctionListItemTradingPrice {
  /**
   * @format float
   * @example 30000
   */
  start?: number;
  /**
   * @format float
   * @example 30000
   */
  current?: number;
  /**
   * @format float
   * @example 30000
   */
  current_no_vat?: number;
}

export interface AuctionListItemTradingYour {
  /**
   * Есть ли ставка от текущего пользователя
   * @example false
   */
  bet?: boolean;
  /**
   * Последняя ставка пользователя
   * @example 30000
   */
  last_bet?: number | null;
}

/** Мета-данные пагинации внешнего сервиса. */
export interface AuctionListMeta {
  /** @example 1 */
  current_page?: number;
  /** @example 1 */
  from?: number;
  /** @example 575 */
  last_page?: number;
  /** @example 2 */
  per_page?: number;
  /** @example 20 */
  to?: number;
  /** @example 1149 */
  total?: number;
}

/** Фильтры и параметры пагинации списка аукционов */
export interface AuctionListRequest {
  /**
   * Запрашиваемая страница
   * @example 1
   */
  page?: number;
  /**
   * Количество элементов на странице
   * @example 20
   */
  per_page?: number;
  /**
   * Порядок сортировки по дате: true = ASC, false / null = DESC
   * @example false
   */
  is_oldest?: boolean;
  /**
   * Сортировка по полям; ключ — имя поля, значение — направление
   * @example {"start_time":"asc","price_per_km":"asc","current_price":"asc"}
   */
  sort?: Record<string, "asc" | "desc"> | null;
  /**
   * Фильтр по торговому статусу пользователя (строковые значения)
   *
   * Торговый статус пользователя в аукционе:
   * * **NotParticipating** — не участвует (1)
   * * **Leading** — лидирует (2)
   * * **Losing** — перебит (3)
   * * **Winner** — победитель (4)
   * * **Confirmed** — подтверждён (5)
   * * **Unknown** — неизвестный статус
   * @example ["Leading","Losing"]
   */
  status?: (
    | "NotParticipating"
    | "Leading"
    | "Losing"
    | "OnPending"
    | "Confirmed"
    | "ChoosingWinner"
    | "Winner"
    | "Accepted"
    | "Unknown"
  )[];
  /**
   * Фильтр по торговому статусу пользователя (числовые значения)
   * @example [2,3]
   */
  mobile_statuses?: number[];
  /**
   * Фильтр по статусу аукциона (числовые значения: 1–7)
   * @example [2]
   */
  statuses?: number[];
  /**
   * Номер заявки
   * @example "00000001059"
   */
  cargo_num?: string;
  /**
   * Вес груза от (т)
   * @example 5
   */
  weight_from?: number;
  /**
   * Вес груза до (т)
   * @example 5
   */
  weight_to?: number;
  /**
   * Объём груза от (м³)
   * @example 10
   */
  volume_from?: number;
  /**
   * Объём груза до (м³)
   * @example 82
   */
  volume_to?: number;
  /**
   * Фильтр по типу кузова
   * @example ["тентованный","фургон"]
   */
  body_types?: string[];
  /**
   * Тип формы
   * @example null
   */
  form_type?: string | null;
  /**
   * Только международные перевозки
   * @example false
   */
  is_international_shipment?: boolean;
  /**
   * Название города погрузки
   * @example "Пермь"
   */
  load_city?: string;
  /**
   * GC ID города погрузки
   * @example 59
   */
  load_gc_id?: number;
  /**
   * Радиус поиска от города погрузки (км)
   * @example 100
   */
  load_range?: number;
  /**
   * Название города выгрузки
   * @example "Москва"
   */
  unload_city?: string;
  /**
   * GC ID города выгрузки
   * @example 100
   */
  unload_gc_id?: number;
  /**
   * Радиус поиска от города выгрузки (км)
   * @example 50
   */
  unload_range?: number;
  /**
   * Дата и время погрузки от (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  load_date_from?: string;
  /**
   * Дата и время погрузки до (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  load_date_to?: string;
  /**
   * Дата выгрузки от (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  unload_date_from?: string;
  /**
   * Дата выгрузки до (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  unload_date_to?: string;
  /**
   * Дата создания аукциона от (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  create_date_from?: string;
  /**
   * Дата создания аукциона до (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  create_date_to?: string;
  /**
   * Начало торгов от (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  start_time_from?: string;
  /**
   * Начало торгов до (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  start_time_to?: string;
  /**
   * Окончание торгов от (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  stop_time_from?: string;
  /**
   * Окончание торгов до (ISO 8601 со смещением)
   * @format date-time
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$
   * @example "2026-05-26T15:30:00+03:00"
   */
  stop_time_to?: string;
  /**
   * Только доступные для ставки аукционы
   * @example true
   */
  is_available?: boolean;
  /**
   * Только избранные аукционы
   * @example true
   */
  is_favorite?: boolean;
  /**
   * Только аукционы, в которых пользователь участвовал
   * @example true
   */
  is_bidder?: boolean;
  /**
   * Поиск по названию или ИНН заказчика
   * @example "ЛИМ"
   */
  customer?: string;
  /**
   * Фильтр по ID заказчиков
   * @example [330,340]
   */
  customer_ids?: number[];
  /**
   * Поиск по перевозчику
   * @example null
   */
  contractor?: string | null;
  /**
   * Фильтр по ID аукционов
   * @example [1224,1236]
   */
  auction_ids?: number[];
  /**
   * Заменять внешние площадки
   * @example null
   */
  replace_external_pads?: boolean | null;
  /**
   * Цена от
   * @format float
   * @example null
   */
  current_price_from?: number | null;
  /**
   * Цена до
   * @format float
   * @example null
   */
  current_price_to?: number | null;
  /**
   * Цена за км от
   * @format float
   * @example null
   */
  price_per_km_from?: number | null;
  /**
   * Цена за км до
   * @format float
   * @example null
   */
  price_per_km_to?: number | null;
  /**
   * Фильтр по типу аукциона
   *
   * Тип аукциона:
   * * **Request** — подтверждён (1)
   * * **Up** — подтверждён (2)
   * * **Down** — подтверждён (3)
   * * **FixPrice** — подтверждён (4)
   * * **Unknown** — неизвестный статус
   * @example ["Request","Up"]
   */
  auc_type?: ("Request" | "Up" | "Down" | "FixPrice")[];
}

/** Корневой объект ответа списка аукционов с мета-данными. */
export interface AuctionListResponseBase {
  /** Коллекция аукционов */
  data?: AuctionListItem[];
  /** Мета-данные пагинации внешнего сервиса. */
  meta?: AuctionListMeta;
}

export interface AuctionShowCargo {
  /**
   * Цена груза
   * @example "0"
   */
  price?: string;
  /** @example 643 */
  currency?: number | null;
  /** @example false */
  is_international?: boolean;
  /**
   * Расстояние в км
   * @example 1500
   */
  distance?: number | null;
  /** @example 1 */
  truck_count?: number;
  /** @example "тентованный" */
  body_type?: string;
  /** @example null */
  temp_from?: number | null;
  /** @example null */
  temp_to?: number | null;
  /** @example null */
  conics?: number | null;
  /** @example null */
  belts?: number | null;
  /** @example null */
  adr?: number | null;
  /** @example null */
  coupling?: boolean | null;
  /** @example null */
  air_pass?: boolean | null;
  /** @example null */
  low_loader?: boolean | null;
  /** @example null */
  additional_load?: boolean | null;
  /** @example false */
  containered?: boolean;
  /** @example null */
  container_type?: string | null;
  /** @example null */
  container_size?: string | null;
  loading_types?: LoadingTypes;
  docs?: Docs;
  /** Требования к ТС; null если не заданы */
  car?: CarRequirements;
}

export interface AuctionShowMain {
  /** @example 1236 */
  id?: number;
  /** @example "00000001059" */
  cargo_num?: string;
  /**
   * @format date-time
   * @example "2026-05-04T14:49:09"
   */
  cargo_date?: string;
  /**
   * @format uuid
   * @example "3a05d045-0e67-4f85-b20a-de81d18bba7a"
   */
  order_uid?: string;
  /**
   * Тип аукциона:
   * - `Request` — заявочный (1)
   * - `Up` — на повышение (2)
   * - `Down` — на понижение (3)
   * - `FixPrice` — фиксированная цена (4)
   * - `Unknown` — неизвестный тип
   */
  auc_type?: AuctionType;
  /**
   * @format date-time
   * @example "2026-05-25T11:48:20"
   */
  created_at?: string;
}

export interface AuctionShowOrganizer {
  /** @example 98 */
  subscriber_id?: number;
  /** @example "12345" */
  subscriber_code?: string;
  /** @example "RU_Cargo_01" */
  infobase_code?: string;
  /** @example "ЛИМ" */
  organization_name?: string;
  /** @example "7703769184" */
  organization_inn?: string;
  /** @example "770301001" */
  organization_kpp?: string;
  /** @example 340 */
  organization_id?: number;
}

export interface AuctionShowPayment {
  /** @example "По оригиналам накладных (ТН, ТТН, CMR)" */
  condition?: string | null;
  /** @example "ПоОригиналамНаладных" */
  condition_predefined?: string | null;
  /** @example "Безналичная с НДС" */
  form?: string;
  /**
   * Отсрочка платежа
   * @example 30
   */
  delay?: number | null;
  /**
   * Тип отсрочки платежа:
   * - `CalendarDays` — календарные дни (1)
   * - `WorkDays` — рабочие дни (2)
   * - `Unknown` — неизвестный тип
   */
  delay_type?: PaymentDelayType;
  /**
   * Код валюты (ISO 4217 numeric)
   * @example "643"
   */
  currency_code?: string;
  /** @example "0" */
  prepay?: string | null;
}

export interface AuctionShowResponse {
  main: AuctionShowMain;
  organizer: AuctionShowOrganizer;
  /** Контакты организатора (пустой массив если данных нет) */
  contacts: Contact[];
  cargo: AuctionShowCargo;
  trading: AuctionShowTrading;
  payment: AuctionShowPayment;
  assembly: Assembly;
  routes: RoutePoint[];
  /** Допущенные к торгам организации */
  admitted_organizations: AdmittedOrganization[];
  /** @example true */
  hide_bets_history?: boolean;
}

export interface AuctionShowTrading {
  /**
   * Статус аукциона:
   * - `Planning` — планирование (1)
   * - `Auction` — торги идут (2)
   * - `DeterminateWinner` — определение победителя (3)
   * - `WaitDeal` — ожидание сделки (4)
   * - `InProgress` — в работе (5)
   * - `Finished` — завершён (6)
   * - `Stopped` — остановлен (7)
   * - `Canceled` — отменён (8)
   * - `Unknown` — неизвестный статус
   */
  status?: AuctionStatus;
  /**
   * Торговый статус пользователя в аукционе:
   * - `NotParticipating` — не участвует (1)
   * - `Leading` — лидирует (2)
   * - `Losing` — перебит (3)
   * - `Winner` — победитель (4)
   * - `Confirmed` — подтверждён (5)
   * - `Unknown` — неизвестный статус
   */
  status_mobile?: TradingStatus;
  /**
   * @format date-time
   * @example "2026-05-25T16:03:00"
   */
  start_time?: string;
  /**
   * @format date-time
   * @example "2026-05-25T16:18:00"
   */
  stop_time?: string;
  /**
   * Единица измерения ставки:
   * - `PerRoute` — за рейс (0)
   * - `PerKm` — за км (1)
   * - `Unknown` — неизвестный тип
   */
  bid_measurement_type?: BidMeasurementType;
  /** @example false */
  can_set_bet?: boolean;
  /** @example true */
  allow_counter_bets?: boolean;
  /** @example true */
  hide_bets_history?: boolean;
  /** @example true */
  hide_places?: boolean;
  /** @example false */
  no_view_cargo_price?: boolean;
  /** @example true */
  hide_points_address_and_contacts?: boolean;
  /** @example false */
  is_bidder?: boolean;
  /** @example false */
  is_favorite?: boolean;
  /** @example null */
  is_last_bet_with_vat?: boolean | null;
  /** @example false */
  red_bet_with_vat?: boolean;
  /** @example false */
  red_bet_no_vat?: boolean;
  /** @example false */
  send_deal_before_load?: boolean;
  /** @example null */
  chat_id?: string | null;
  price?: AuctionShowTradingPrice;
  your?: AuctionShowTradingYour;
  settings?: AuctionShowTradingSettings;
}

export interface AuctionShowTradingPrice {
  /**
   * @format float
   * @example 30000
   */
  start?: number | null;
  /**
   * @format float
   * @example 25000
   */
  start_no_vat?: number | null;
  /**
   * @format float
   * @example 30000
   */
  current?: number | null;
  /**
   * @format float
   * @example 24590.16
   */
  current_no_vat?: number | null;
  /**
   * @format float
   * @example 29000
   */
  available?: number | null;
  /**
   * @format float
   * @example 24166
   */
  available_no_vat?: number | null;
  /**
   * @format float
   * @example 20000
   */
  min?: number | null;
  /**
   * @format float
   * @example 16666.67
   */
  min_no_vat?: number | null;
  /**
   * @format float
   * @example 30000
   */
  max?: number | null;
  /**
   * @format float
   * @example 25000
   */
  max_no_vat?: number | null;
  /**
   * @format float
   * @example 500
   */
  step?: number | null;
  /**
   * @format float
   * @example 416.67
   */
  step_no_vat?: number | null;
  /**
   * current_price_no_vat / distance; 0 если distance = 0
   * @format float
   * @example 16.39
   */
  price_per_km?: number;
}

export interface AuctionShowTradingSettings {
  /**
   * Продление аукциона после ставки (мин)
   * @example 10
   */
  prolong_after_bet?: number | null;
  /** @example 1 */
  winner_confirm?: number | null;
  /** @example null */
  winner_counter_mode?: number | null;
  /**
   * Время на передачу (ч)
   * @example 24
   */
  transmission_time_in?: number | null;
  /** @example 10 */
  coefficient?: number | null;
}

export interface AuctionShowTradingYour {
  /** @example false */
  bet?: boolean;
  /** @example null */
  last_bet?: number | null;
  /** @example null */
  last_bet_with_vat?: number | null;
  /** @example false */
  win?: boolean;
}

export interface BetItem {
  /**
   * ID ставки
   * @example 42
   */
  id?: number;
  /**
   * Дата и время создания ставки
   * @format date-time
   * @example "2026-05-25T16:05:00"
   */
  created_at?: string;
  /**
   * ID аукциона
   * @example 1236
   */
  auction_id?: number;
  /**
   * ID подписчика (перевозчика)
   * @example 13
   */
  subscriber_id?: number;
  /**
   * Имя контактного лица
   * @example "Иванов Иван"
   */
  contact_name?: string;
  /**
   * Телефон контактного лица (пустая строка если не задан)
   * @example "+79001234567"
   */
  contact_phone?: string;
  /**
   * Цена ставки с НДС
   * @format float
   * @example 30000
   */
  price_with_vat?: number;
  /**
   * Цена ставки без НДС
   * @format float
   * @example 24590.16
   */
  price_no_vat?: number;
  /**
   * ID организации перевозчика
   * @example 14
   */
  organization_id?: number;
  /**
   * ИНН организации перевозчика
   * @example "9616244307"
   */
  organization_inn?: string;
  /**
   * Название организации перевозчика (пустая строка если не задано)
   * @example "ООО Перевозчик"
   */
  organization_name?: string;
  /** @example null */
  transporter_comment?: string | null;
  /**
   * Ставка отклонена
   * @example false
   */
  is_rejected?: boolean;
  /**
   * Ставка является встречной
   * @example false
   */
  is_counter?: boolean;
  /**
   * Место в рейтинге ставок
   * @example 1
   */
  place?: number | null;
  /**
   * Ставка является победившей
   * @example false
   */
  is_win?: boolean;
  /**
   * Номер рейса (0 если не задан)
   * @example 0
   */
  run_number?: number;
  /**
   * Причина отмены ставки (пустая строка если не отменена)
   * @example ""
   */
  cancel_reason?: string;
  price_info?: BetItemPriceInfo;
}

export interface BetItemPriceInfo {
  /**
   * @format float
   * @example 30000
   */
  price_with_vat?: number | null;
  /**
   * @format float
   * @example 24590.16
   */
  price_no_vat?: number | null;
  /** @example "Безналичная с НДС" */
  payment_type?: string | null;
  /** @example "20" */
  vat_rate?: string | null;
}

export interface BetListResponse {
  bets: BetItem[];
}

/** Требования к ТС; null если не заданы */
export type CarRequirements = {
  /** @example "Тягач" */
  type?: string;
  /**
   * @format float
   * @example 20
   */
  weight?: number | null;
  /**
   * @format float
   * @example 82
   */
  volume?: number | null;
  /**
   * @format float
   * @example 2.4
   */
  width?: number | null;
  /**
   * @format float
   * @example 13.6
   */
  length?: number | null;
  /**
   * @format float
   * @example 2.7
   */
  height?: number | null;
} | null;

export interface Contact {
  /** @example "Иванов Иван Иванович" */
  name?: string | null;
  /** @example "+79001234567" */
  phone?: string | null;
  /** @example null */
  work_phone?: string | null;
  /** @example "550e8400-e29b-41d4-a716-446655440000" */
  uid?: string | null;
  /** @example "ivanov@example.com" */
  email?: string | null;
}

export interface Docs {
  /** @example false */
  tir?: boolean;
  /** @example false */
  cmr?: boolean;
  /** @example false */
  t1?: boolean;
  /** @example false */
  med?: boolean;
}

export interface LoadingTypes {
  /** @example false */
  side?: boolean;
  /** @example false */
  top?: boolean;
  /** @example false */
  rear?: boolean;
  /** @example false */
  full?: boolean;
}

/** Единый формат ошибки API (см. error-response-guideline.md). HTTP-код — в статус-строке ответа, в теле не дублируется. */
export interface ProblemDetail {
  /**
   * Машиночитаемый код (snake_case), стабилен между релизами
   * @example "resource_not_found"
   */
  code: string;
  /**
   * Короткое название типа ошибки
   * @example "Не найдено"
   */
  title: string;
  /**
   * Пояснение конкретного случая
   * @example "Заявка не найдена"
   */
  message: string;
  /**
   * Идентификатор запроса для корреляции с логами
   * @example "0af7651916cd43dd8448eb211c80319c"
   */
  trace_id?: string | null;
}

export interface RoutePoint {
  /** @example 1 */
  row_num?: number;
  /**
   * Тип операции маршрутной точки:
   * - `Loading` — погрузка (1)
   * - `Unloading` — выгрузка (2)
   * - `Unknown` — неизвестный тип
   */
  op_type?: OperationType;
  /**
   * @format date-time
   * @example "2026-05-26T09:00:00"
   */
  start_date?: string;
  /**
   * @format date-time
   * @example "2026-05-26T18:00:00"
   */
  end_date?: string;
  /** @example null */
  comment?: string | null;
  /** @example "" */
  contractor?: string;
  /** @example "" */
  contractor_inn?: string;
  location?: RoutePointLocation;
  cargo?: RoutePointCargo;
  contact?: RoutePointContact;
}

export interface RoutePointCargo {
  /** @example "Мороженое" */
  name?: string;
  /** @example "" */
  package_name?: string;
  /**
   * Вес в тоннах (строковое представление с 3 знаками)
   * @example "1.000"
   */
  weight?: string;
  /**
   * Объём в м³ (строковое представление с 3 знаками)
   * @example "1.000"
   */
  volume?: string;
  /** @example "0" */
  length?: string;
  /** @example "0" */
  width?: string;
  /** @example "0" */
  height?: string;
  /** @example false */
  oversized?: boolean;
  /** @example null */
  package_amount?: number | null;
}

export interface RoutePointContact {
  /** @example "" */
  name?: string;
  /** @example "" */
  phone?: string;
}

export interface RoutePointLocation {
  /** @example "Пермь" */
  city_name?: string;
  /** @example "Пермь, Россия" */
  city_full_name?: string;
  /** @example 59 */
  city_gc_id?: number;
  /** @example "Транспортная 9" */
  loading_address?: string;
  /**
   * @format double
   * @example 56.238
   */
  lon?: number;
  /**
   * @format double
   * @example 58.01
   */
  lat?: number;
}

export interface SetBetRequest {
  /**
   * Цена ставки (> 0)
   * @example 15000
   */
  price: number;
}

/** Ошибка по конкретному полю запроса */
export interface ValidationError {
  /**
   * Путь к полю (snake_case, вложенные — через точку)
   * @example "per_page"
   */
  field: string;
  /** @example "Значение должно быть не больше 100." */
  message: string;
  /**
   * Машиночитаемый код нарушения
   * @example "max_value"
   */
  code?: string | null;
}

/** Ошибка валидации входных данных (422). Отличается от бизнес-ошибки кодом `validation_failed` и наличием `errors[]`. */
export interface ValidationProblem {
  /** @example "validation_failed" */
  code: string;
  /** @example "Ошибка валидации" */
  title: string;
  /** @example "Запрос содержит некорректные поля." */
  message: string;
  /** @example "0af7651916cd43dd8448eb211c80319c" */
  trace_id?: string | null;
  errors: ValidationError[];
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/api/v1/",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API для UL - Auctions
 * @version 1.0.0
 * @baseUrl /api/v1/
 *
 * API для мобильных приложений и web UL
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auctions = {
    /**
     * @description Получение списка аукционов с заданными фильтрами
     *
     * @tags Auctions
     * @name ListAuctions
     * @summary Список аукционов
     * @request POST:/auctions/list
     */
    listAuctions: (data?: AuctionListRequest, params: RequestParams = {}) =>
      this.request<AuctionListResponseBase, ProblemDetail | ValidationProblem>({
        path: `/auctions/list`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение подробных данных аукциона
     *
     * @tags Auctions
     * @name GetAuction
     * @summary Данные аукциона
     * @request GET:/auctions/{auctionUuid}
     */
    getAuction: (auctionUuid: string, params: RequestParams = {}) =>
      this.request<AuctionShowResponse, ProblemDetail>({
        path: `/auctions/${auctionUuid}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Запрос вернет список ставок, которые были сделаны в этом аукционе
     *
     * @tags Auctions
     * @name ListBets
     * @summary Список ставок аукциона
     * @request GET:/auctions/{auctionUuid}/bets
     */
    listBets: (
      auctionUuid: string,
      query?: {
        /** Вернуть все ставки аукциона, в том числе отмененные */
        all?: boolean | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<BetListResponse, ProblemDetail>({
        path: `/auctions/${auctionUuid}/bets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Установить ставку в аукционе
     *
     * @tags Auctions
     * @name SetBet
     * @summary Установить ставку
     * @request POST:/auctions/{auctionUuid}/bets
     */
    setBet: (
      auctionUuid: string,
      data: SetBetRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, ProblemDetail | ValidationProblem>({
        path: `/auctions/${auctionUuid}/bets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}

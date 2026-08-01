import { HttpResponse, http } from "msw"

import type {
  BetListResponse,
  ProblemDetail,
} from "@/shared/api/generated/Api"

import { auctionStore } from "../store"

export const listAuctionBetsHandler = http.get<
  { auctionUuid: string },
  never,
  BetListResponse | ProblemDetail
>("/api/v1/auctions/:auctionUuid/bets", ({ params, request }) => {
  const record = auctionStore.get(params.auctionUuid)

  if (!record) {
    const problem = {
      code: "resource_not_found",
      title: "Не найдено",
      message: "Заявка не найдена",
    } satisfies ProblemDetail

    return HttpResponse.json<ProblemDetail>(problem, {
      status: 404,
      headers: {
        "Content-Type": "application/problem+json",
      },
    })
  }

  const includeCanceled =
    new URL(request.url).searchParams.get("all") === "true"
  const bets = includeCanceled
    ? record.bets
    : record.bets.filter((bet) => !bet.cancel_reason)

  return HttpResponse.json<BetListResponse>({ bets })
})

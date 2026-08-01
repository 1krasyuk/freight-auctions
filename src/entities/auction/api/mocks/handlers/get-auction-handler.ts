import { HttpResponse, http } from "msw"

import type {
  AuctionShowResponse,
  ProblemDetail,
} from "@/shared/api/generated/Api"

import { auctionStore } from "../store"

export const getAuctionHandler = http.get<
  { auctionUuid: string },
  never,
  AuctionShowResponse | ProblemDetail
>("/api/v1/auctions/:auctionUuid", ({ params }) => {
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

  return HttpResponse.json<AuctionShowResponse>(record.detail)
})

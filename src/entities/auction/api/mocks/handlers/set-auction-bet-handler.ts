import { HttpResponse, http } from "msw"

import {
  type ProblemDetail,
  type SetBetRequest,
  type ValidationProblem,
} from "@/shared/api/generated/Api"
import { setAuctionBet } from "../set-auction-bet"
import { auctionStore } from "../store"

function createValidationResponse(
  message: string,
  field: "price" | null = "price"
) {
  const problem = {
    code: "validation_failed",
    title: field === null ? "Не удалось установить ставку" : "Ошибка валидации",
    message: field === null ? message : "Запрос содержит некорректные поля.",
    errors: field === null ? [] : [{ field, message }],
  } satisfies ValidationProblem

  return HttpResponse.json<ValidationProblem>(problem, {
    status: 422,
    headers: {
      "Content-Type": "application/problem+json",
    },
  })
}

export const setAuctionBetHandler = http.post<
  { auctionUuid: string },
  SetBetRequest,
  ProblemDetail | ValidationProblem | null
>("/api/v1/auctions/:auctionUuid/bets", async ({ params, request }) => {
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

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return createValidationResponse("Укажите корректную цену ставки.")
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("price" in body) ||
    typeof body.price !== "number"
  ) {
    return createValidationResponse("Укажите корректную цену ставки.")
  }

  const result = setAuctionBet(record, { price: body.price })

  if (!result.success) {
    return createValidationResponse(result.message, result.field)
  }

  return new HttpResponse(null, { status: 200 })
})

import { HttpResponse, http } from "msw"

import type {
  AuctionListRequest,
  AuctionListResponseBase,
  ValidationError,
  ValidationProblem,
} from "@/shared/api/generated/Api"

import {
  createAuctionListResponse,
  validateAuctionListRequest,
} from "./list-auctions"
import { auctionStore } from "./store"

function createValidationResponse(errors: ValidationError[]) {
  const problem = {
    code: "validation_failed",
    title: "Ошибка валидации",
    message: "Запрос содержит некорректные поля.",
    errors,
  } satisfies ValidationProblem

  return HttpResponse.json<ValidationProblem>(problem, {
    status: 422,
    headers: {
      "Content-Type": "application/problem+json",
    },
  })
}

export const auctionHandlers = [
  http.post<
    never,
    AuctionListRequest,
    AuctionListResponseBase | ValidationProblem
  >("/api/v1/auctions/list", async ({ request }) => {
    const rawBody = await request.text()
    let parsedBody: unknown = {}

    if (rawBody.trim()) {
      try {
        parsedBody = JSON.parse(rawBody)
      } catch {
        return createValidationResponse([
          {
            field: "body",
            message: "Некорректный формат запроса.",
          },
        ])
      }
    }

    if (
      typeof parsedBody !== "object" ||
      parsedBody === null ||
      Array.isArray(parsedBody)
    ) {
      return createValidationResponse([
        {
          field: "body",
          message: "Некорректный формат запроса.",
        },
      ])
    }

    const validationErrors = validateAuctionListRequest(parsedBody)

    if (validationErrors.length > 0) {
      return createValidationResponse(validationErrors)
    }

    const requestBody = parsedBody as AuctionListRequest
    const listItems = Array.from(
      auctionStore.values(),
      ({ listItem }) => listItem
    )
    const response = createAuctionListResponse(listItems, requestBody)

    return HttpResponse.json<AuctionListResponseBase>(response)
  }),
]

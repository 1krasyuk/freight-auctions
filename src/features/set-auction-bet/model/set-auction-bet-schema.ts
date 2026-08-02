import { z } from "zod"

export type AuctionBetPriceLimits = {
  min?: number | null
  max?: number | null
  step?: number | null
}

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
})

function matchesStep(price: number, min: number | null, step: number) {
  const stepCount = (price - (min ?? 0)) / step

  return Math.abs(stepCount - Math.round(stepCount)) < 1e-6
}

export function createSetAuctionBetSchema({
  min = null,
  max = null,
  step = null,
}: AuctionBetPriceLimits) {
  return z
    .object({
      price: z
        .number({ error: "Укажите корректную цену ставки." })
        .finite("Укажите корректную цену ставки.")
        .positive("Цена должна быть больше нуля."),
    })
    .superRefine(({ price }, context) => {
      if (min !== null && price < min) {
        context.addIssue({
          code: "custom",
          path: ["price"],
          message: `Минимальная ставка — ${priceFormatter.format(min)}.`,
        })
      }

      if (max !== null && price > max) {
        context.addIssue({
          code: "custom",
          path: ["price"],
          message: `Максимальная ставка — ${priceFormatter.format(max)}.`,
        })
      }

      if (
        step !== null &&
        step > 0 &&
        !matchesStep(price, min, step)
      ) {
        context.addIssue({
          code: "custom",
          path: ["price"],
          message: `Цена должна учитывать шаг ${priceFormatter.format(step)}.`,
        })
      }
    })
}

export type SetAuctionBetFormValues = z.infer<
  ReturnType<typeof createSetAuctionBetSchema>
>

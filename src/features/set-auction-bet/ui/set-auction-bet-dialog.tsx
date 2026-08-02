import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CircleDollarSignIcon,
  CornerDownRightIcon,
  LoaderCircleIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { isAxiosError } from "axios"
import { toast } from "sonner"

import { type AuctionDetail, useSetAuctionBet } from "@/entities/auction"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  createSetAuctionBetSchema,
  type SetAuctionBetFormValues,
} from "../model/set-auction-bet-schema"

type SetAuctionBetDialogProps = {
  auctionUuid: string
  trading: AuctionDetail["trading"]
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ProblemDetailLike = {
  code: string
  title: string
  message: string
}

type ValidationProblemLike = ProblemDetailLike & {
  errors: Array<{
    field: string
    message: string
  }>
}

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isProblemDetail(value: unknown): value is ProblemDetailLike {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.title === "string" &&
    typeof value.message === "string"
  )
}

function isValidationProblem(value: unknown): value is ValidationProblemLike {
  return (
    isProblemDetail(value) &&
    "errors" in value &&
    Array.isArray(value.errors) &&
    value.errors.every(
      (error) =>
        isRecord(error) &&
        typeof error.field === "string" &&
        typeof error.message === "string"
    )
  )
}

function getFallbackErrorMessage(status: number | undefined) {
  switch (status) {
    case 401:
      return "Для установки ставки необходимо авторизоваться."
    case 404:
      return "Аукцион не найден."
    case 503:
      return "Сервис временно недоступен. Попробуйте ещё раз позже."
    default:
      return "Проверьте соединение и попробуйте ещё раз."
  }
}

function PriceLimit({
  label,
  value,
}: {
  label: string
  value: number | null | undefined
}) {
  return (
    <div className="min-w-0 px-2 text-center first:pl-0 last:pr-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 truncate text-sm font-semibold text-foreground">
        {value == null ? "Не задано" : priceFormatter.format(value)}
      </dd>
    </div>
  )
}

export function SetAuctionBetDialog({
  auctionUuid,
  trading,
  open,
  onOpenChange,
}: SetAuctionBetDialogProps) {
  const mutation = useSetAuctionBet(auctionUuid)
  const price = trading.price
  const canSetBet = trading.can_set_bet === true
  const hasBet = trading.your?.bet === true
  const actionLabel = hasBet ? "Изменить ставку" : "Сделать ставку"
  const schema = useMemo(
    () =>
      createSetAuctionBetSchema({
        min: price?.min,
        max: price?.max,
        step: price?.step,
      }),
    [price?.max, price?.min, price?.step]
  )
  const form = useForm<SetAuctionBetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: trading.your?.last_bet ?? undefined,
    },
  })

  function changeOpen(nextOpen: boolean) {
    if (nextOpen && !canSetBet) return

    if (nextOpen) {
      form.reset({
        price: trading.your?.last_bet ?? undefined,
      })
    }

    onOpenChange(nextOpen)
  }

  async function submit(values: SetAuctionBetFormValues) {
    if (!canSetBet) return

    form.clearErrors("root.server")

    try {
      await mutation.mutateAsync({ price: values.price })
      form.reset({ price: values.price })
      onOpenChange(false)
      toast.success("Ставка принята", {
        description: "Данные аукциона обновлены.",
      })
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined
      const responseData = isAxiosError(error)
        ? error.response?.data
        : undefined

      if (status === 422 && isValidationProblem(responseData)) {
        const priceError = responseData.errors.find(
          (validationError) => validationError.field === "price"
        )

        if (priceError) {
          form.setError("price", {
            type: "server",
            message: priceError.message,
          })
        } else {
          form.setError("root.server", {
            type: "server",
            message: responseData.message,
          })
        }

        toast.error(responseData.title, {
          description: responseData.message,
        })
        return
      }

      const title = isProblemDetail(responseData)
        ? responseData.title
        : "Не удалось установить ставку"
      const message = isProblemDetail(responseData)
        ? responseData.message
        : getFallbackErrorMessage(status)

      form.setError("root.server", { type: "server", message })
      toast.error(title, { description: message })
    }
  }

  const isSubmitting = form.formState.isSubmitting || mutation.isPending

  return (
    <Dialog open={open && canSetBet} onOpenChange={changeOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="lg"
            variant={canSetBet ? "default" : "secondary"}
            disabled={!canSetBet}
            title={canSetBet ? undefined : "Ставка сейчас недоступна"}
            className="h-10 px-5 text-sm"
          />
        }
      >
        <CircleDollarSignIcon />
        {canSetBet ? actionLabel : "Ставка недоступна"}
      </DialogTrigger>

      <DialogContent className="gap-5 p-5 sm:max-w-md sm:p-6">
        <DialogHeader className="pr-7">
          <DialogTitle className="text-xl font-bold">{actionLabel}</DialogTitle>
          <DialogDescription className="text-sm">
            Укажите цену и подтвердите ставку. Перед отправкой проверьте
            ограничения аукциона.
          </DialogDescription>
        </DialogHeader>

        <form
          id="set-auction-bet-form"
          className="space-y-5"
          onSubmit={form.handleSubmit(submit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="auction-bet-price" className="text-sm">
              Цена ставки, ₽
            </Label>
            <Input
              id="auction-bet-price"
              type="number"
              inputMode="decimal"
              min={price?.min ?? 0.01}
              max={price?.max ?? undefined}
              step={price?.step && price.step > 0 ? price.step : "any"}
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.price)}
              aria-describedby="auction-bet-price-help auction-bet-price-error"
              className="h-11 [appearance:textfield] px-3 text-base! [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...form.register("price", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
            {price?.available != null ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSubmitting}
                className="-mt-1 h-6 w-fit px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                  form.setValue("price", price.available as number, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              >
                <CornerDownRightIcon />
                <span>Доступная ставка:</span>
                <strong>{priceFormatter.format(price.available)}</strong>
              </Button>
            ) : null}
            {form.formState.errors.price ? (
              <p
                id="auction-bet-price-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {form.formState.errors.price.message}
              </p>
            ) : null}
          </div>

          <div
            id="auction-bet-price-help"
            className="rounded-xl border bg-muted/40 p-3"
          >
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <SlidersHorizontalIcon className="size-3.5 text-primary" />
              Условия ставки
            </p>
            <dl className="mt-3 grid grid-cols-3 divide-x">
              <PriceLimit label="Минимум" value={price?.min} />
              <PriceLimit label="Шаг" value={price?.step} />
              <PriceLimit label="Максимум" value={price?.max} />
            </dl>
          </div>

          {form.formState.errors.root?.server ? (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </p>
          ) : null}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            className="h-10 px-4 text-sm"
            onClick={() => changeOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="set-auction-bet-form"
            size="lg"
            disabled={isSubmitting}
            className="h-10 px-4 text-sm"
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CircleDollarSignIcon />
            )}
            {isSubmitting ? "Отправляем..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import {
  Building2Icon,
  CreditCardIcon,
  EyeOffIcon,
  UserRoundIcon,
} from "lucide-react"

import type { AuctionDetail } from "@/entities/auction"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"

type AuctionTermsCardProps = {
  organizer: AuctionDetail["organizer"]
  contacts: AuctionDetail["contacts"]
  payment: AuctionDetail["payment"]
  hideContacts: boolean
}

const paymentDelayLabels: Record<string, string> = {
  CalendarDays: "календарных дней",
  WorkDays: "рабочих дней",
  Unknown: "дней",
}

export function AuctionTermsCard({
  organizer,
  contacts,
  payment,
  hideContacts,
}: AuctionTermsCardProps) {
  const paymentDelay =
    payment.delay == null
      ? "Не указана"
      : `${payment.delay} ${paymentDelayLabels[payment.delay_type ?? "Unknown"]}`

  return (
    <Card className="[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader className="flex! flex-row items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2Icon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-xl">Организатор и оплата</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {organizer.organization_name ?? "Организатор не указан"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:flex sm:w-fit sm:gap-10 sm:[&>div]:relative sm:[&>div:not(:first-child)]:before:absolute sm:[&>div:not(:first-child)]:before:top-1/2 sm:[&>div:not(:first-child)]:before:-left-6 sm:[&>div:not(:first-child)]:before:-translate-y-1/2 sm:[&>div:not(:first-child)]:before:text-xl sm:[&>div:not(:first-child)]:before:leading-none sm:[&>div:not(:first-child)]:before:text-muted-foreground sm:[&>div:not(:first-child)]:before:content-['·']">
          <div>
            <dt className="text-muted-foreground">ИНН</dt>
            <dd className="font-semibold">
              {organizer.organization_inn ?? "Не указан"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">КПП</dt>
            <dd className="font-semibold">
              {organizer.organization_kpp ?? "Не указан"}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-muted-foreground">Код подписчика</dt>
            <dd className="font-semibold">
              {organizer.subscriber_code ?? "Не указан"}
            </dd>
          </div>
        </dl>

        <Separator />

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-6">
          <section>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="size-5 text-primary" />
              <h3 className="text-base font-semibold">Условия оплаты</h3>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Форма</dt>
                <dd className="font-medium">{payment.form ?? "Не указана"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Условие</dt>
                <dd className="font-medium">
                  {payment.condition ?? "Не указано"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Отсрочка</dt>
                <dd className="font-medium">{paymentDelay}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Предоплата</dt>
                <dd className="font-medium">
                  {payment.prepay ?? "Не указана"}
                </dd>
              </div>
            </dl>
          </section>

          <Separator className="sm:hidden" />
          <Separator orientation="vertical" className="hidden sm:block" />

          <section>
            <div className="flex items-center gap-2">
              <UserRoundIcon className="size-5 text-primary" />
              <h3 className="text-base font-semibold">Контакты</h3>
            </div>
            {hideContacts ? (
              <Alert className="mt-3 block p-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <EyeOffIcon className="size-5" />
                  <AlertTitle className="text-base font-semibold">
                    Контакты скрыты
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-1 text-sm">
                  Организатор ограничил просмотр контактных данных.
                </AlertDescription>
              </Alert>
            ) : contacts.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {contacts.map((contact, index) => (
                  <li
                    key={
                      contact.uid ?? `${contact.email ?? "contact"}-${index}`
                    }
                    className="text-sm"
                  >
                    <p className="font-semibold">{contact.name ?? "Контакт"}</p>
                    <p className="text-muted-foreground">
                      {[contact.phone, contact.work_phone, contact.email]
                        .filter(Boolean)
                        .join(" · ") || "Контактные данные не указаны"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Контакты не указаны.
              </p>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

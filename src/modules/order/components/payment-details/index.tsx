"use client";

import { useState, useEffect } from "react";

import { Container, Heading, Text } from "@medusajs/ui";
import { CreditCard } from "@medusajs/icons";

import { getPaymentInfoMap, isStripe } from "@lib/constants";
import Divider from "@modules/common/components/divider";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";

import { getClientLanguage } from "@lib/i18n";
import { DEFAULT_LANG, type Lang } from "@lib/languages";
import { getMessages } from "@lib/messages";

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const t = getMessages(lang);
  const paymentInfoMap = getPaymentInfoMap(lang);
  
  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const payment = order.payment_collections?.[0]?.payments?.[0]

  // Bei unbekannter Zahlungsart die Kennung zeigen, statt abzustürzen.
  const info = payment ? paymentInfoMap[payment.provider_id] : undefined

  const amount = payment
    ? convertToLocale({ amount: payment.amount, currency_code: order.currency_code })
    : ""

  // captured_at = Geld ist da. Bei Karte sofort, bei Vorauszahlung und
  // Rechnung erst, wenn im Admin "Zahlung erfassen" geklickt wurde.
  const capturedAt = (payment as any)?.captured_at as string | null | undefined

  const status = capturedAt
    ? `${t.payment.paid_on} ${new Date(capturedAt).toLocaleDateString(lang)}`
    : t.payment.not_paid

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t.payment.title}
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.payment.payment_method}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {info?.title ?? payment.provider_id}
              </Text>
            </div>
            <div className="flex flex-col w-2/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.payment.payment_details}
              </Text>
              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {info?.icon ?? <CreditCard />}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${amount} – ${status}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails;

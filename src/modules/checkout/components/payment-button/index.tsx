"use client";

import { isManual, isStripe } from "@lib/constants";
import { placeOrder, forgetCart } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import ErrorMessage from "../error-message";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

import { useParams } from "next/navigation";


type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const lang = getClientLanguage();
  const t = getMessages(lang);

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0];

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>{t.order.order_info}</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {

  const lang = getClientLanguage();
  const t = getMessages(lang);

  const { countryCode } = useParams() as { countryCode: string };

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPaymentCompleted = async () => {

    await placeOrder()
          .catch((err) => {
        // Next.js meldet eine Weiterleitung über eine geworfene Ausnahme.
        // Sie muss durchgereicht werden – sonst erscheint eine Fehlermeldung,
        // obwohl die Bestellung erfolgreich war.
        if (
          err?.message === "NEXT_REDIRECT" ||
          (typeof err?.digest === "string" && err.digest.startsWith("NEXT_REDIRECT"))
        ) {
          throw err
        }

        setErrorMessage(err.message)
      })

      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe();
  const elements = useElements();

  const disabled = !stripe || !elements ? true : false;

    const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !cart) {
      setSubmitting(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${countryCode}/checkout/payment-return`,
      },
      redirect: "if_required",
    })

      if (error) {
      console.error("[Bestellung] Stripe meldet:", error)
      setErrorMessage(error.message || null)
      return
    }

    // Asynchron (z. B. SEPA): Bestellung wird per Webhook erstellt
    if (paymentIntent && paymentIntent.status === "processing") 
      {
        await forgetCart();
        window.location.href = `/${countryCode}/order/processing`;
        return;
    }

    if (
      paymentIntent &&
      (paymentIntent.status === "succeeded" ||
        paymentIntent.status === "requires_capture")
    ) {
      onPaymentCompleted()
      return
    }

    setSubmitting(false);
  }


  return (
    <>
      <button
        disabled={disabled || notReady}
        onClick={handlePayment}
        data-testid={dataTestId}
        className={`h-10 px-4 rounded-md text-base-regular transition-colors bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-hover)] ${
          submitting ? "cursor-wait" : "disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {t.order.place_order}
      </button>

      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {

  const lang = getClientLanguage();
  const t = getMessages(lang);

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
           .catch((err) => {
        if (
          err?.message === "NEXT_REDIRECT" ||
          (typeof err?.digest === "string" && err.digest.startsWith("NEXT_REDIRECT"))
        ) {
          throw err
        }
        setErrorMessage(err.message)
      })

      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady}
        onClick={handlePayment}
        data-testid="submit-order-button"
        className={`h-10 px-4 rounded-md text-base-regular transition-colors bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-hover)] ${
          submitting ? "cursor-wait" : "disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {t.order.place_order}
      </button>

      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton;

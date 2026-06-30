"use client";

import { isManual, isStripe } from "@lib/constants";
import { placeOrder } from "@lib/data/cart";
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
      setErrorMessage(error.message || null)
      setSubmitting(false)
      return
    }

    if (
      paymentIntent &&
      (paymentIntent.status === "succeeded" ||
        paymentIntent.status === "requires_capture" ||
        paymentIntent.status === "processing")
    ) {
      onPaymentCompleted()
      return
    }

    setSubmitting(false)
  }


  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        {t.order.place_order}
      </Button>
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
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        {t.order.place_order}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton;

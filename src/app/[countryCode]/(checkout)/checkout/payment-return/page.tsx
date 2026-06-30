"use client";

import { Suspense, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { placeOrder } from "@lib/data/cart";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function PaymentReturnInner() 
{
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const clientSecret = searchParams.get("payment_intent_client_secret");
      if (!clientSecret) 
        {
        setError("Fehlende Zahlungsinformationen.");
        return;
      }

      const stripe = await stripePromise;

      if (!stripe) 
        {
        setError("Stripe konnte nicht geladen werden.");
        return;
      }

      const { paymentIntent, error: piError } = await stripe.retrievePaymentIntent(clientSecret);

      if (piError || !paymentIntent) 
        {
        setError(piError?.message || "Zahlung konnte nicht geprüft werden.");
        return;
      }

    if (["succeeded", "processing", "requires_capture"].includes(paymentIntent.status)) {
        await placeOrder().catch((e: any) => {
          if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
            return
          }
          setError(e?.message || "Bestellung konnte nicht abgeschlossen werden.")
        })
      } else {
        setError(`Zahlung nicht erfolgreich (Status: ${paymentIntent.status}).`);
      }
    }

    run()
  }, [searchParams])

  return (
    <div className="content-container py-12 flex flex-col items-center gap-4">
      {error ? (
        <>
          <p className="text-rose-500">{error}</p>
          <a href="/checkout?step=payment" className="underline">Zurück zur Zahlung</a>
        </>
      ) : (
        <p>Zahlung wird geprüft, bitte einen Moment …</p>
      )}
    </div>
  )
}

export default function PaymentReturnPage() 
{
  return (
    <Suspense fallback={<p className="content-container py-12">Lädt …</p>}>
      <PaymentReturnInner />
    </Suspense>
  )
}

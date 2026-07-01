"use client";

import { Suspense, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useSearchParams } from "next/navigation";
import { placeOrder, forgetCart } from "@lib/data/cart";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function PaymentReturnInner() 
{
  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);
    
  useEffect(() => {
        setLang(getClientLanguage())
        }, []);


  const searchParams = useSearchParams();
  const { countryCode } = useParams() as { countryCode: string };
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const clientSecret = searchParams.get("payment_intent_client_secret");
      if (!clientSecret) 
        {
        setError(t.payment.missing_pay_info);
        return;
      }

      const stripe = await stripePromise;

      if (!stripe) 
        {
        setError(t.payment.no_load_stripe);
        return;
      }

      const { paymentIntent, error: piError } = await stripe.retrievePaymentIntent(clientSecret);

      if (piError || !paymentIntent) 
        {
        setError(piError?.message || t.payment.no_check_pay);
        return;
      }

    if (paymentIntent.status === "processing") 
        {
          await forgetCart();
          window.location.href = `/${countryCode}/order/processing`;
          return
      }

    if (["succeeded", "requires_capture"].includes(paymentIntent.status)) 
        {
        await placeOrder().catch((e: any) => {
          if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) 
            {
            return
          }
          setError(e?.message || t.payment.no_order_completed);
        })
      } else {
        setError(`${t.payment.pay_unsuccessful} (Status: ${paymentIntent.status}).`);
      }
    }

    run()
  }, [searchParams])

  return (
    <div className="content-container py-12 flex flex-col items-center gap-4">
      {error ? (
        <>
          <p className="text-rose-500">{error}</p>
          <a href="/checkout?step=payment" className="underline">{t.payment.back_to_payment}</a>
        </>
      ) : (
        <p>{t.payment.payment_check}</p>
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

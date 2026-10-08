"use client";

import { RadioGroup } from "@headlessui/react";
import { getPaymentInfoMap, isStripe as isStripeFunc } from "@lib/constants";
import { initiatePaymentSession, syncGiftCards } from "@lib/data/cart";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { Button, Container, Heading, Text, clx } from "@medusajs/ui";
import ErrorMessage from "@modules/checkout/components/error-message";
import PaymentContainer, {StripePaymentElementContainer, StripeCardContainer} from "@modules/checkout/components/payment-container";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getClientLanguage } from "@lib/i18n";
import { DEFAULT_LANG } from "@lib/languages";
import { getMessages, type Lang } from "@lib/messages";

const Payment = ({
  cart,
  availablePaymentMethods,
  onlyCardPayment = false,
}: {
  cart: any
  availablePaymentMethods: any[]
  // true, wenn eine Geschenkkarte im Warenkorb liegt
  onlyCardPayment?: boolean
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const t = getMessages(lang);
  const paymentInfoMap = getPaymentInfoMap(lang);
  
  useEffect(() => {
      setLang(getClientLanguage());
    }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(activeSession?.provider_id ?? "");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "payment";

  const isStripe = isStripeFunc(selectedPaymentMethod);

  // Bei Geschenkkarten nur Kartenzahlung und Paypal zulassen. Stripe zeigt sonst auch
  // SEPA-Lastschrift an – die ist erst nach Tagen sicher und kann noch
  // zurückgebucht werden, wenn die Karte längst verschickt ist.
  const sessionInput = (method: string) => ({
    provider_id: method,
    ...(onlyCardPayment && isStripeFunc(method)
      ? { data: { payment_method_types: ["card", "paypal"] } }
      : {}),
  })

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) 
    {
      await initiatePaymentSession(cart, sessionInput(method))
    }
  }

    const hasGiftCards = (cart?.credit_lines ?? []).some((line: any) => line?.reference === "gift_card")

  // Bezahlt die Geschenkkarte alles, gibt es nichts mehr auszuwählen.
  // Medusa verlangt trotzdem eine "Zahlung" – dafür wird im Hintergrund die
  // eingebaute Zahlungsart über 0 € angelegt (pp_system_default).
  const paidByGiftcard = hasGiftCards && Number(cart?.total ?? 0) <= 0.005;


  const paymentReady = (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString();
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard = isStripeFunc(selectedPaymentMethod) && !activeSession;

      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod;

      if (!checkActiveSession) 
      {
        await initiatePaymentSession(cart, sessionInput(selectedPaymentMethod));
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      if (paidByGiftcard) {
        // 0-€-Zahlung anlegen, falls es noch keine gibt.
        if (activeSession?.provider_id !== "pp_system_default") {
          await initiatePaymentSession(cart, { provider_id: "pp_system_default" })
        }
        return router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
      }
    }
  }

  // Sobald der Zahlungsschritt aufgeht, steht der Endbetrag samt Versand
  // fest. Dann die Geschenkkarten neu verrechnen lassen, damit sie z. B.
  // auch den Versand abdecken.

  useEffect(() => {
    setError(null)
    if (isOpen && hasGiftCards) {
      syncGiftCards().then((changed) => {
        if (changed) router.refresh()
      })
    }
  }, [isOpen])


  return (
    <div className="bg-[var(--brand-surface-bg)]">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          {t.payment.title}
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              type="button" 
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              {t.function.change}
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {onlyCardPayment && (
            <Text className="txt-medium text-ui-fg-subtle mb-4">
              {t.payment.gift_card_card_only}
            </Text>
          )}
          {/* "> 0" ist wichtig: Ohne würde React bei leerer Liste eine "0" anzeigen. */}
          {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (

            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripePaymentElementContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.payment.payment_method}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {t.payment.gift_card}
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <button
            onClick={handleSubmit}
            disabled={!selectedPaymentMethod && !paidByGiftcard}
            data-testid="submit-payment-button"
            className={`mt-6 h-10 px-4 rounded-md text-base-regular transition-colors bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-hover)] ${
              isLoading ? "cursor-wait" : "disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? t.payment.give_card_details
              : t.payment.continue_checking}
          </button>

        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t.payment.payment_method}
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t.payment.payment_details}
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : t.payment.next_step}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.payment.payment_method}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {t.payment.gift_card}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment;

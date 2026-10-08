/**
 * Geschenkkarten im Shop erkennen – dieselbe Regel wie im Backend
 * (medusa-backend/src/lib/gift-card.ts): metadata.is_giftcard am Produkt.
 *
 * Bewusst nicht in constants.tsx ("use client"), damit die Kasse sie auf
 * dem Server benutzen kann.
 */
export const isGiftCardProduct = (metadata: unknown): boolean => {
  const raw = (metadata as Record<string, unknown> | null | undefined)?.is_giftcard
  return raw === true || raw === "true"
}

/** Liegt mindestens eine Geschenkkarte im Warenkorb? */
export const cartContainsGiftCard = (cart: any): boolean =>
  (cart?.items ?? []).some((item: any) =>
    isGiftCardProduct(item?.product?.metadata ?? item?.variant?.product?.metadata)
  )

/** Sofortzahlung über Stripe (Karte usw.) – nur damit sind Geschenkkarten kaufbar. */
export const isInstantPayment = (providerId?: string) =>
  typeof providerId === "string" && providerId.startsWith("pp_stripe")


/** Kennzeichen der Gutschrift – muss zum Backend passen. */
export const GIFT_CARD_CREDIT_REFERENCE = "gift_card"

/** Sieht die Eingabe wie ein Geschenkkarten-Code aus? (beginnt mit "GK") */
export const looksLikeGiftCardCode = (input: string) => /^\s*gk[\s-]?/i.test(input)

/** Code gekürzt anzeigen, z. B. "GK-…-9HWP". */
export const maskGiftCardCode = (code: unknown) => {
  const text = typeof code === "string" ? code : ""
  return text.length > 4 ? `GK-…-${text.slice(-4)}` : text
}


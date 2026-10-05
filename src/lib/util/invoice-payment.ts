/**
 * Kennung der Zahlungsart "Auf Rechnung" – muss zum Backend passen
 * (medusa-backend/src/lib/customer-number.ts).
 *
 * Bewusst NICHT in constants.tsx: Die Datei ist mit "use client" markiert,
 * ihre Funktionen lassen sich in Server-Komponenten (z. B. der Kasse) nicht
 * aufrufen.
 */
export const INVOICE_PROVIDER_ID = "pp_invoice_invoice"

export const isInvoice = (providerId?: string) => providerId === INVOICE_PROVIDER_ID

/**
 * Darf dieser Kunde auf Rechnung kaufen? Nur wer angemeldet ist und eine
 * Kundennummer hat.
 *
 * Das dient nur dem Ausblenden. Die eigentliche Sperre sitzt auf dem Server
 * beim Bestellabschluss.
 */
export const canPayByInvoice = (
  customer?: { metadata?: Record<string, unknown> | null } | null
) => {
  const raw = customer?.metadata?.customer_number
  return (typeof raw === "string" || typeof raw === "number") && String(raw).trim() !== ""
}

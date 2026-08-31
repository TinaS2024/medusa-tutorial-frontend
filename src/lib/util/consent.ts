export type Consent = {
  optionalAccepted: boolean
  decidedAt: string
}

const KEY = "cookie_consent"

/** Gespeicherte Entscheidung, oder null wenn noch keine getroffen wurde. */
export const readConsent = (): Consent | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export const saveConsent = (optionalAccepted: boolean) => {
  const entry: Consent = { optionalAccepted, decidedAt: new Date().toISOString() }
  window.localStorage.setItem(KEY, JSON.stringify(entry));
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: entry }));
}

/**
 * Vor dem Laden nicht-notwendiger Dienste abfragen.
 *
 * Beispiel für eine spätere Statistik-Einbindung:
 *   if (hasConsent()) { ...Skript laden... }
 */
export const hasConsent = (): boolean => readConsent()?.optionalAccepted === true;

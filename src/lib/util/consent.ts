export type Einwilligung = {
  optional: boolean
  zeitpunkt: string
}

const SCHLUESSEL = "cookie_consent"

/** Gespeicherte Entscheidung, oder null wenn noch keine getroffen wurde. */
export const leseEinwilligung = (): Einwilligung | null => {
  if (typeof window === "undefined") return null;

  try {
    const roh = window.localStorage.getItem(SCHLUESSEL);
    return roh ? (JSON.parse(roh) as Einwilligung) : null;
  } catch {
    return null;
  }
}

export const speichereEinwilligung = (optional: boolean) => {
  const eintrag: Einwilligung = { optional, zeitpunkt: new Date().toISOString() }
  window.localStorage.setItem(SCHLUESSEL, JSON.stringify(eintrag));
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: eintrag }));
}

/**
 * Vor dem Laden nicht-notwendiger Dienste abfragen.
 *
 * Beispiel für eine spätere Statistik-Einbindung:
 *   if (hatEinwilligung()) { ...Skript laden... }
 */
export const hatEinwilligung = (): boolean => leseEinwilligung()?.optional === true;

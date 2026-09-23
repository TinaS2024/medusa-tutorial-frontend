/**
 * Die Sprachen des Storefronts – die einzige Stelle, an der sie stehen.
 *
 * Eine neue Sprache hinzufügen:
 *   1. hier eine Zeile ergänzen,
 *   2. src/locales/en.json kopieren, umbenennen (z. B. it.json), übersetzen,
 *   3. die Datei in lib/messages.ts eintragen.
 * Fehlt Schritt 3, meldet TypeScript das sofort.
 */
export const LANGUAGES = [
  { code: "de", locale: "de-DE", label: "DE" },
  { code: "en", locale: "en-GB", label: "EN" },
  { code: "fr", locale: "fr-FR", label: "FR" },
  { code: "nl", locale: "nl-NL", label: "NL" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const isLang = (value: string): value is Lang =>
  LANGUAGES.some((language) => language.code === value);

/**
 * Für Sprachen, die der Shop nicht anbietet. Englisch versteht ein
 * ausländischer Kunde eher als die Hauptsprache des Betreibers.
 */
export const FALLBACK_LANG: Lang = "en";

/**
 * Wenn gar keine Sprache bekannt ist, etwa beim ersten Besuch: die
 * Hauptsprache des Shops aus NEXT_PUBLIC_DEFAULT_LOCALE. Ohne Angabe Deutsch.
 */
const configured = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "").slice(0, 2).toLowerCase();

export const DEFAULT_LANG: Lang = isLang(configured) ? configured : "de";

/** "fr-FR", "fr" oder "FR" → "fr". Unbekannt → Englisch, leer → Hauptsprache. */
export const localeToLang = (locale?: string | null): Lang => {
  if (!locale) return DEFAULT_LANG;
  const code = locale.slice(0, 2).toLowerCase();
  return isLang(code) ? code : FALLBACK_LANG;
};

/** "de" → "de-DE" – für Datums- und Geldformate. */
export const langToLocale = (lang: string): string =>
  LANGUAGES.find((language) => language.code === lang)?.locale ?? "en-GB";

const FALLBACK_LANG = "de" as const;

const localeToLang = (locale?: string): "de" | "en" | "fr" | "nl" => {
  if (!locale) return FALLBACK_LANG;

  if (locale.startsWith("de")) return "de";
  if (locale.startsWith("en")) return "en";
  if (locale.startsWith("fr")) return "fr";
  if (locale.startsWith("nl")) return "nl";

  return FALLBACK_LANG;
}

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const prefixed = `${name}=`;

  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefixed)) {
      return decodeURIComponent(part.slice(prefixed.length));
    }
  }

  return undefined;
};

export const getClientLanguage = (): "de" | "en" | "fr" | "nl" => {
  if (typeof window === "undefined") return FALLBACK_LANG;

  // Cookie zuerst: Er ist die einzige Quelle, die serverseitiges Rendern
  // (getServerLanguage) und andere Anwendungen auf derselben Domäne teilen.
  // localStorage ist pro Ursprung getrennt – Port 8000 sieht Port 3000 nicht.
  // Ohne diese Reihenfolge widerspricht der Client dem Server und die Sprache
  // springt beim Hydrieren zurück.
  const cookieLocale = getCookie("_medusa_locale");
  if (cookieLocale) return localeToLang(cookieLocale);

  const stored = window.localStorage.getItem("ui_locale");
  return localeToLang(stored ?? undefined);
};

import { DEFAULT_LANG, localeToLang, type Lang } from "./languages";

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

export const getClientLanguage = (): Lang => {
  if (typeof window === "undefined") return DEFAULT_LANG;

  // Cookie zuerst: Er ist die einzige Quelle, die serverseitiges Rendern
  // (getServerLanguage) und andere Anwendungen auf derselben Domäne teilen.
  // localStorage ist pro Ursprung getrennt – Port 8000 sieht Port 3000 nicht.
  // Ohne diese Reihenfolge widerspricht der Client dem Server und die Sprache
  // springt beim Hydrieren zurück.
  const cookieLocale = getCookie("_medusa_locale");
  if (cookieLocale) return localeToLang(cookieLocale);

  return localeToLang(window.localStorage.getItem("ui_locale"));
};

import { cookies } from "next/headers";

const FALLBACK_LANG = "de" as const;

const localeToLang = (locale?: string): "de" | "en" | "fr" | "nl" => {
  if (!locale) return FALLBACK_LANG;

  if (locale.startsWith("de")) return "de";
  if (locale.startsWith("en")) return "en";
  if (locale.startsWith("fr")) return "fr";
  if (locale.startsWith("nl")) return "nl";

  return FALLBACK_LANG;
}

export const getServerLanguage = async (): Promise<"de" | "en" | "fr" | "nl"> => {
  try {
    const cookies_ = await cookies();
    const locale = cookies_.get("_medusa_locale")?.value;
    return localeToLang(locale);
  } catch {
    return FALLBACK_LANG;
  }
}

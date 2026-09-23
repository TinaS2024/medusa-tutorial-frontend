import { cookies } from "next/headers";

import { DEFAULT_LANG, localeToLang, type Lang } from "./languages";

export const getServerLanguage = async (): Promise<Lang> => {
  try {
    const cookies_ = await cookies();
    return localeToLang(cookies_.get("_medusa_locale")?.value);
  } catch {
    return DEFAULT_LANG;
  }
};

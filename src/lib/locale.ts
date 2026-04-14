import { cookies } from "next/headers";

export const getLocaleHeader = async (): Promise<Record<string, string>> => {
  try {
    const cookies_ = await cookies();
    const locale = cookies_.get("_medusa_locale")?.value;

    if (!locale) 
    {
      return {}
    }

    return { "x-medusa-locale": locale }
  } catch {
    return {}
  }
}

export const getLocaleFromCookies = async (): Promise<string | undefined> => {
  try {
    const cookies_ = await cookies();
    return cookies_.get("_medusa_locale")?.value;
  } catch {
    return undefined;
  }
}
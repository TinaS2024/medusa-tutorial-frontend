"use server";

import { sdk } from "@lib/config";
import { getCacheOptions } from "./cookies";
import type { LegalTexts } from "@lib/util/legal-text";

export type Legal = {
  imprint_company: string | null
  imprint_address: string | null
  imprint_represented_by: string | null
  imprint_phone: string | null
  imprint_email: string | null
  imprint_register: string | null
  imprint_vat_id: string | null
  imprint_extra: string | null
  cookie_banner_enabled: string | null
  cookie_banner_text: string | null
}

export const retrieveLegal = async (): Promise<Legal | null> => {
  const next = {
    ...(await getCacheOptions("legal")),
    revalidate: 60,
  }

  return sdk.client
    .fetch<{ legal: Legal }>("/store/legal", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ legal }) => legal)
    .catch(() => null)
}

export const retrieveLegalTexts = async (): Promise<LegalTexts> => {
  const next = {
    ...(await getCacheOptions("legal")),
    revalidate: 60,
  }

  return sdk.client
    .fetch<{ texts: LegalTexts }>("/store/legal", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ texts }) => texts ?? {})
    .catch(() => ({}))
}

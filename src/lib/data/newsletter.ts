"use server";

import { sdk } from "@lib/config";

export async function newsletterAnmelden(email: string, locale: string) 
{
  return sdk.client
    .fetch<{ ok: boolean }>("/store/newsletter/subscribe", {
      method: "POST",
      body: { email, locale },
      cache: "no-store",
    })
    .then(() => true)
    .catch(() => false)
}

export async function newsletterBestaetigen(token: string) {
  return sdk.client
    .fetch<{ ok: boolean }>(`/store/newsletter/confirm?token=${encodeURIComponent(token)}`, {
      method: "GET",
      cache: "no-store",
    })
    .then(() => true)
    .catch(() => false)
}

export async function newsletterAbmelden(token: string) {
  return sdk.client
    .fetch<{ ok: boolean }>(`/store/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
      method: "GET",
      cache: "no-store",
    })
    .then(() => true)
    .catch(() => false)
}
